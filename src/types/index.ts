export interface SmtpBasicAuth {
  type: 'basic';
  user: string;
  pass: string;
}

export interface SmtpOAuth2Auth {
  type: 'oauth2';
  user: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  accessToken?: string;
}

export type SmtpAuthConfig = SmtpBasicAuth | SmtpOAuth2Auth;

export interface SmtpConfig {
  host: string;
  port: number;
  secure?: boolean; // true for 465, false for 587 / 25
  requireTLS?: boolean;
  auth: SmtpAuthConfig;
  fromName?: string;
  fromAddress?: string;
  rateLimitPerMinute?: number;
  maxConnections?: number;
  rejectUnauthorized?: boolean;
}

export interface ImapConfig {
  host: string;
  port: number;
  secure?: boolean; // true for 993
  auth: SmtpAuthConfig;
  defaultMailbox?: string;
  tlsOptions?: {
    rejectUnauthorized?: boolean;
  };
}

export interface SecurityConfig {
  allowedRecipientDomains?: string[]; // e.g. ['company.com', 'partner.org']
  allowedRecipients?: string[]; // exact emails or wildcard patterns
  blockedRecipients?: string[]; // blacklisted emails
  maxEmailSizeMb?: number; // max total size of message + attachments
  maxEmailsPerHour?: number;
  requireSenderApproval?: boolean;
}

export interface TemplateConfig {
  inlineTemplates?: Record<string, string>; // e.g. { 'welcome': '<h1>Hello {{name}}</h1>' }
}

export interface PluginConfig {
  smtp?: SmtpConfig;
  imap?: ImapConfig;
  security?: SecurityConfig;
  templates?: TemplateConfig;
}

export interface EmailAttachment {
  filename: string;
  content?: string; // plain text or base64
  encoding?: string; // e.g., 'base64', 'utf-8'
  path?: string; // local file path
  contentType?: string;
}

export interface SendEmailOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  templateName?: string;
  templateData?: Record<string, any>;
  attachments?: EmailAttachment[];
  replyTo?: string;
  headers?: Record<string, string>;
}

export interface ReadEmailsOptions {
  mailbox?: string; // default: 'INBOX'
  unreadOnly?: boolean;
  limit?: number; // max count to return (default: 10)
  sinceDate?: string; // ISO date string
  fromAddress?: string;
  subjectSearch?: string;
  markAsRead?: boolean;
}

export interface EmailHeaderDetail {
  address: string;
  name?: string;
}

export interface ExtractedEmail {
  id: string | number;
  uid?: number;
  messageId?: string;
  subject: string;
  from: string | EmailHeaderDetail;
  to: Array<string | EmailHeaderDetail>;
  cc?: Array<string | EmailHeaderDetail>;
  date: string;
  text?: string;
  html?: string;
  flags: string[];
  attachmentsCount: number;
  attachments?: Array<{
    filename: string;
    contentType: string;
    size: number;
  }>;
}

export interface OpenClawToolResult<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
