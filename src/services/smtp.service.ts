import nodemailer, { Transporter } from 'nodemailer';
import { SmtpConfig, SendEmailOptions, OpenClawToolResult } from '../types';
import { SecurityManager } from '../security/allowlist';
import { TemplateService } from './template.service';

export class SmtpService {
  private transporter: Transporter | null = null;
  private config: SmtpConfig | null = null;
  private securityManager: SecurityManager;
  private templateService: TemplateService;

  constructor(
    config?: SmtpConfig,
    securityManager?: SecurityManager,
    templateService?: TemplateService
  ) {
    this.securityManager = securityManager || new SecurityManager();
    this.templateService = templateService || new TemplateService();
    if (config) {
      this.configure(config);
    }
  }

  public configure(config: SmtpConfig): void {
    this.config = config;
    const transportOptions: any = {
      host: config.host,
      port: config.port,
      secure: config.secure ?? (config.port === 465),
      requireTLS: config.requireTLS,
      maxConnections: config.maxConnections ?? 5,
      tls: {
        rejectUnauthorized: config.rejectUnauthorized ?? true,
      },
    };

    if (config.auth.type === 'basic') {
      transportOptions.auth = {
        user: config.auth.user,
        pass: config.auth.pass,
      };
    } else if (config.auth.type === 'oauth2') {
      transportOptions.auth = {
        type: 'OAuth2',
        user: config.auth.user,
        clientId: config.auth.clientId,
        clientSecret: config.auth.clientSecret,
        refreshToken: config.auth.refreshToken,
        accessToken: config.auth.accessToken,
      };
    }

    this.transporter = nodemailer.createTransport(transportOptions);
  }

  public async verifyConnection(): Promise<OpenClawToolResult<{ verified: boolean; host?: string; port?: number }>> {
    if (!this.transporter || !this.config) {
      return {
        success: false,
        message: 'SMTP transporter is not configured. Please supply SMTP settings.',
        error: 'CONFIG_MISSING',
      };
    }

    try {
      await this.transporter.verify();
      return {
        success: true,
        message: `Successfully connected and authenticated to SMTP server at ${this.config.host}:${this.config.port}`,
        data: {
          verified: true,
          host: this.config.host,
          port: this.config.port,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Failed to verify SMTP connection to ${this.config.host}:${this.config.port}: ${err.message}`,
        error: err.message,
      };
    }
  }

  public async sendEmail(options: SendEmailOptions): Promise<OpenClawToolResult<{ messageId: string; accepted: string[]; rejected: string[] }>> {
    if (!this.transporter || !this.config) {
      return {
        success: false,
        message: 'SMTP transport is not configured.',
        error: 'CONFIG_MISSING',
      };
    }

    // Security validation
    const securityCheck = this.securityManager.validateSendRequest(options);
    if (!securityCheck.valid) {
      return {
        success: false,
        message: `Security validation rejected email: ${securityCheck.reason}`,
        error: 'SECURITY_VIOLATION',
      };
    }

    let finalHtml = options.html;
    let finalText = options.text;

    // Handle template rendering if templateName is provided
    if (options.templateName) {
      try {
        const rendered = this.templateService.render(
          options.templateName,
          options.templateData || {}
        );
        // Determine if rendered output is HTML or plain text
        if (rendered.trim().startsWith('<')) {
          finalHtml = rendered;
        } else {
          finalText = rendered;
        }
      } catch (templateErr: any) {
        return {
          success: false,
          message: `Failed to render template "${options.templateName}": ${templateErr.message}`,
          error: 'TEMPLATE_ERROR',
        };
      }
    }

    if (!finalHtml && !finalText) {
      return {
        success: false,
        message: 'Email must contain either plain text, HTML body, or a valid template.',
        error: 'INVALID_PAYLOAD',
      };
    }

    // Determine Sender address
    const fromAddress = this.config.fromAddress || this.config.auth.user;
    const fromHeader = this.config.fromName
      ? `"${this.config.fromName}" <${fromAddress}>`
      : fromAddress;

    // Format attachments
    const mailAttachments = options.attachments?.map((att) => {
      const item: any = {
        filename: att.filename,
        contentType: att.contentType,
      };
      if (att.path) {
        item.path = att.path;
      } else if (att.content) {
        item.content = att.encoding === 'base64' 
          ? Buffer.from(att.content, 'base64')
          : att.content;
      }
      return item;
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: fromHeader,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      text: finalText,
      html: finalHtml,
      replyTo: options.replyTo,
      headers: options.headers,
      attachments: mailAttachments,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.securityManager.recordSend();

      return {
        success: true,
        message: `Email successfully dispatched to [${Array.isArray(options.to) ? options.to.join(', ') : options.to}] (Message-ID: ${info.messageId})`,
        data: {
          messageId: info.messageId,
          accepted: (info.accepted as string[]) || [],
          rejected: (info.rejected as string[]) || [],
        },
      };
    } catch (sendErr: any) {
      return {
        success: false,
        message: `SMTP dispatch failed: ${sendErr.message}`,
        error: sendErr.message,
      };
    }
  }

  public isConfigured(): boolean {
    return this.transporter !== null && this.config !== null;
  }
}
