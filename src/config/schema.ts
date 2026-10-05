import { z } from 'zod';
import { PluginConfig } from '../types';

const SmtpBasicAuthSchema = z.object({
  type: z.literal('basic'),
  user: z.string().min(1, 'SMTP user is required'),
  pass: z.string().min(1, 'SMTP password is required'),
});

const SmtpOAuth2AuthSchema = z.object({
  type: z.literal('oauth2'),
  user: z.string().email(),
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
  refreshToken: z.string().min(1),
  accessToken: z.string().optional(),
});

const SmtpAuthSchema = z.discriminatedUnion('type', [
  SmtpBasicAuthSchema,
  SmtpOAuth2AuthSchema,
]);

export const SmtpConfigSchema = z.object({
  host: z.string().min(1, 'SMTP host is required'),
  port: z.number().int().positive().default(587),
  secure: z.boolean().default(false),
  requireTLS: z.boolean().default(false),
  auth: SmtpAuthSchema,
  fromName: z.string().optional(),
  fromAddress: z.string().email().optional(),
  rateLimitPerMinute: z.number().int().positive().default(60),
  maxConnections: z.number().int().positive().default(5),
  rejectUnauthorized: z.boolean().default(true),
});

export const ImapConfigSchema = z.object({
  host: z.string().min(1, 'IMAP host is required'),
  port: z.number().int().positive().default(993),
  secure: z.boolean().default(true),
  auth: SmtpAuthSchema,
  defaultMailbox: z.string().default('INBOX'),
  tlsOptions: z
    .object({
      rejectUnauthorized: z.boolean().default(true),
    })
    .optional(),
});

export const SecurityConfigSchema = z.object({
  allowedRecipientDomains: z.array(z.string()).optional(),
  allowedRecipients: z.array(z.string()).optional(),
  blockedRecipients: z.array(z.string()).optional(),
  maxEmailSizeMb: z.number().positive().default(25),
  maxEmailsPerHour: z.number().int().positive().default(100),
  requireSenderApproval: z.boolean().default(false),
});

export const TemplateConfigSchema = z.object({
  inlineTemplates: z.record(z.string()).optional(),
});

export const PluginConfigSchema = z.object({
  smtp: SmtpConfigSchema.optional(),
  imap: ImapConfigSchema.optional(),
  security: SecurityConfigSchema.default({}),
  templates: TemplateConfigSchema.default({}),
});

/**
 * Loads configuration from environment variables if explicit config is not passed
 */
export function loadConfigFromEnv(): PluginConfig {
  const config: PluginConfig = {};

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    const isOAuth = process.env.SMTP_AUTH_TYPE === 'oauth2';
    const auth = isOAuth
      ? {
          type: 'oauth2' as const,
          user: process.env.SMTP_USER,
          clientId: process.env.SMTP_CLIENT_ID || '',
          clientSecret: process.env.SMTP_CLIENT_SECRET || '',
          refreshToken: process.env.SMTP_REFRESH_TOKEN || '',
        }
      : {
          type: 'basic' as const,
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS || '',
        };

    config.smtp = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth,
      fromName: process.env.SMTP_FROM_NAME,
      fromAddress: process.env.SMTP_FROM_ADDRESS || process.env.SMTP_USER,
      rateLimitPerMinute: process.env.SMTP_RATE_LIMIT
        ? parseInt(process.env.SMTP_RATE_LIMIT, 10)
        : 60,
    };
  }

  if (process.env.IMAP_HOST && process.env.IMAP_USER) {
    const isOAuth = process.env.IMAP_AUTH_TYPE === 'oauth2';
    const auth = isOAuth
      ? {
          type: 'oauth2' as const,
          user: process.env.IMAP_USER,
          clientId: process.env.IMAP_CLIENT_ID || '',
          clientSecret: process.env.IMAP_CLIENT_SECRET || '',
          refreshToken: process.env.IMAP_REFRESH_TOKEN || '',
        }
      : {
          type: 'basic' as const,
          user: process.env.IMAP_USER,
          pass: process.env.IMAP_PASS || '',
        };

    config.imap = {
      host: process.env.IMAP_HOST,
      port: process.env.IMAP_PORT ? parseInt(process.env.IMAP_PORT, 10) : 993,
      secure: process.env.IMAP_SECURE !== 'false',
      auth,
      defaultMailbox: process.env.IMAP_DEFAULT_MAILBOX || 'INBOX',
    };
  }

  if (process.env.ALLOWED_DOMAINS) {
    config.security = config.security || {};
    config.security.allowedRecipientDomains = process.env.ALLOWED_DOMAINS.split(
      ','
    ).map((d) => d.trim().toLowerCase());
  }

  return config;
}

export function validatePluginConfig(rawConfig: unknown): PluginConfig {
  return PluginConfigSchema.parse(rawConfig);
}
