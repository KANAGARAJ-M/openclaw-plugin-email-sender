import { PluginConfig } from './types';
import { loadConfigFromEnv, validatePluginConfig } from './config/schema';
import { SecurityManager } from './security/allowlist';
import { TemplateService } from './services/template.service';
import { SmtpService } from './services/smtp.service';
import { ImapService } from './services/imap.service';

import { sendEmailToolDefinition, createSendEmailToolHandler } from './tools/sendEmail.tool';
import { readEmailsToolDefinition, createReadEmailsToolHandler } from './tools/readEmails.tool';
import { verifyConnectionToolDefinition, createVerifyConnectionToolHandler } from './tools/verifyConnection.tool';
import { renderTemplateToolDefinition, createRenderTemplateToolHandler } from './tools/renderTemplate.tool';
import { createTemplateToolDefinition, createCreateTemplateToolHandler } from './tools/createTemplate.tool';

export interface OpenClawToolRegistration {
  definition: any;
  handler: (args: any) => Promise<any>;
}

export class OpenClawEmailSenderPlugin {
  public readonly id = 'openclaw-plugin-email-sender';
  public readonly name = 'Email Sender Plugin';
  public readonly version = '1.0.0';
  public readonly description = 'Full SMTP sending & IMAP inbox plugin for OpenClaw with templating and security controls';

  private config: PluginConfig = {};
  private securityManager!: SecurityManager;
  private templateService!: TemplateService;
  private smtpService!: SmtpService;
  private imapService!: ImapService;
  private isInitialized = false;

  constructor(initialConfig?: PluginConfig) {
    if (initialConfig) {
      this.initialize(initialConfig);
    }
  }

  /**
   * Initializes the plugin with explicit configuration or auto-loaded environment variables
   */
  public initialize(rawConfig?: PluginConfig): void {
    const envConfig = loadConfigFromEnv();
    const mergedConfig = {
      ...envConfig,
      ...rawConfig,
      security: {
        ...envConfig.security,
        ...rawConfig?.security,
      },
      templates: {
        ...envConfig.templates,
        ...rawConfig?.templates,
      },
    };

    this.config = validatePluginConfig(mergedConfig);

    this.securityManager = new SecurityManager(this.config.security);
    this.templateService = new TemplateService(this.config.templates);
    this.smtpService = new SmtpService(this.config.smtp, this.securityManager, this.templateService);
    this.imapService = new ImapService(this.config.imap);

    this.isInitialized = true;
  }

  /**
   * Registers a custom email template into the Handlebars engine
   */
  public registerTemplate(name: string, templateString: string): void {
    if (!this.isInitialized) {
      this.initialize();
    }
    this.templateService.registerTemplate(name, templateString);
  }

  /**
   * Export registered tools for OpenClaw runtime
   */
  public getTools(): OpenClawToolRegistration[] {
    if (!this.isInitialized) {
      this.initialize();
    }

    return [
      {
        definition: sendEmailToolDefinition,
        handler: createSendEmailToolHandler(this.smtpService),
      },
      {
        definition: readEmailsToolDefinition,
        handler: createReadEmailsToolHandler(this.imapService),
      },
      {
        definition: verifyConnectionToolDefinition,
        handler: createVerifyConnectionToolHandler(this.smtpService, this.imapService),
      },
      {
        definition: renderTemplateToolDefinition,
        handler: createRenderTemplateToolHandler(this.templateService),
      },
      {
        definition: createTemplateToolDefinition,
        handler: createCreateTemplateToolHandler(this.templateService),
      },
    ];
  }

  public getSmtpService(): SmtpService {
    return this.smtpService;
  }

  public getImapService(): ImapService {
    return this.imapService;
  }

  public getSecurityManager(): SecurityManager {
    return this.securityManager;
  }

  public getTemplateService(): TemplateService {
    return this.templateService;
  }

  public getConfig(): PluginConfig {
    return this.config;
  }
}
