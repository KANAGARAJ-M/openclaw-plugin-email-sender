import { SmtpService } from '../services/smtp.service';
import { SendEmailOptions, OpenClawToolResult } from '../types';

export const sendEmailToolDefinition = {
  name: 'send_email',
  description: 'Send an email via SMTP (supports HTML, plain text, Handlebars templates, attachments, CC/BCC)',
  parameters: {
    type: 'object',
    properties: {
      to: {
        type: 'array',
        items: { type: 'string' },
        description: 'Recipient email address(es) (e.g. ["user@example.com"])',
      },
      subject: {
        type: 'string',
        description: 'Subject line of the email',
      },
      text: {
        type: 'string',
        description: 'Plain text email body',
      },
      html: {
        type: 'string',
        description: 'HTML formatted email body',
      },
      templateName: {
        type: 'string',
        description: 'Name of a registered email template to render',
      },
      templateData: {
        type: 'object',
        description: 'Key-value data variables passed into the template',
      },
      cc: {
        type: 'array',
        items: { type: 'string' },
        description: 'Carbon copy recipient email address(es)',
      },
      bcc: {
        type: 'array',
        items: { type: 'string' },
        description: 'Blind carbon copy recipient email address(es)',
      },
      replyTo: {
        type: 'string',
        description: 'Reply-To email address',
      },
      attachments: {
        type: 'array',
        description: 'Array of attachments with filename and content or path',
        items: {
          type: 'object',
          properties: {
            filename: { type: 'string' },
            content: { type: 'string' },
            encoding: { type: 'string', enum: ['utf-8', 'base64'] },
            path: { type: 'string' },
            contentType: { type: 'string' },
          },
          required: ['filename'],
        },
      },
    },
    required: ['to', 'subject'],
  },
};

export function createSendEmailToolHandler(smtpService: SmtpService) {
  return async (args: any): Promise<OpenClawToolResult> => {
    try {
      const options: SendEmailOptions = {
        to: Array.isArray(args.to) ? args.to : [args.to],
        cc: args.cc,
        bcc: args.bcc,
        subject: args.subject,
        text: args.text,
        html: args.html,
        templateName: args.templateName,
        templateData: args.templateData,
        replyTo: args.replyTo,
        attachments: args.attachments,
      };

      return await smtpService.sendEmail(options);
    } catch (err: any) {
      return {
        success: false,
        message: `Error executing send_email tool: ${err.message}`,
        error: err.message,
      };
    }
  };
}
