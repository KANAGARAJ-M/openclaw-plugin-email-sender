import { SecurityConfig, SendEmailOptions } from '../types';

export class SecurityManager {
  private config: SecurityConfig;
  private sentTimestamps: number[] = [];

  constructor(config: SecurityConfig = {}) {
    this.config = {
      maxEmailSizeMb: 25,
      maxEmailsPerHour: 100,
      requireSenderApproval: false,
      ...config,
    };
  }

  public updateConfig(config: SecurityConfig) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Validate email options against security rules
   */
  public validateSendRequest(options: SendEmailOptions): {
    valid: boolean;
    reason?: string;
  } {
    const recipients = Array.isArray(options.to)
      ? options.to
      : [options.to];
    
    if (options.cc) {
      recipients.push(...(Array.isArray(options.cc) ? options.cc : [options.cc]));
    }
    if (options.bcc) {
      recipients.push(...(Array.isArray(options.bcc) ? options.bcc : [options.bcc]));
    }

    if (recipients.length === 0) {
      return { valid: false, reason: 'At least one recipient email address must be provided' };
    }

    // Check recipients against blocked lists & allowed lists
    for (const email of recipients) {
      const normalizedEmail = this.extractCleanEmail(email).toLowerCase();
      const domain = normalizedEmail.split('@')[1];

      if (!domain) {
        return { valid: false, reason: `Invalid email address format: "${email}"` };
      }

      // Check blocked list
      if (
        this.config.blockedRecipients &&
        this.config.blockedRecipients.some(
          (b) => b.toLowerCase() === normalizedEmail || b.toLowerCase() === `@${domain}`
        )
      ) {
        return {
          valid: false,
          reason: `Recipient "${normalizedEmail}" is blocked by security policy`,
        };
      }

      // Check allowed domains if restriction active
      if (
        this.config.allowedRecipientDomains &&
        this.config.allowedRecipientDomains.length > 0
      ) {
        const isDomainAllowed = this.config.allowedRecipientDomains.some(
          (allowed) => allowed.toLowerCase() === domain
        );
        if (!isDomainAllowed) {
          return {
            valid: false,
            reason: `Recipient domain "${domain}" is not in the allowed domains list: [${this.config.allowedRecipientDomains.join(
              ', '
            )}]`,
          };
        }
      }

      // Check allowed explicit recipients if active
      if (
        this.config.allowedRecipients &&
        this.config.allowedRecipients.length > 0
      ) {
        const isRecipientAllowed = this.config.allowedRecipients.some(
          (allowed) => allowed.toLowerCase() === normalizedEmail
        );
        if (!isRecipientAllowed) {
          return {
            valid: false,
            reason: `Recipient "${normalizedEmail}" is not in the explicit recipient allowlist`,
          };
        }
      }
    }

    // Check Rate limits
    const now = Date.now();
    const oneHourAgo = now - 3600 * 1000;
    this.sentTimestamps = this.sentTimestamps.filter((t) => t > oneHourAgo);

    const maxPerHour = this.config.maxEmailsPerHour ?? 100;
    if (this.sentTimestamps.length >= maxPerHour) {
      return {
        valid: false,
        reason: `Rate limit exceeded: Maximum ${maxPerHour} emails per hour reached`,
      };
    }

    // Check attachment total size
    if (options.attachments && options.attachments.length > 0) {
      let estimatedSizeBytes = 0;
      for (const att of options.attachments) {
        if (att.content) {
          // If string, estimate length
          estimatedSizeBytes += Buffer.byteLength(att.content, (att.encoding as any) || 'utf-8');
        }
      }

      const maxBytes = (this.config.maxEmailSizeMb ?? 25) * 1024 * 1024;
      if (estimatedSizeBytes > maxBytes) {
        return {
          valid: false,
          reason: `Attachment size limit exceeded (${(
            estimatedSizeBytes /
            (1024 * 1024)
          ).toFixed(2)} MB exceeds max ${this.config.maxEmailSizeMb} MB)`,
        };
      }
    }

    return { valid: true };
  }

  public recordSend() {
    this.sentTimestamps.push(Date.now());
  }

  private extractCleanEmail(raw: string): string {
    const match = raw.match(/<([^>]+)>/);
    return match ? match[1].trim() : raw.trim();
  }
}
