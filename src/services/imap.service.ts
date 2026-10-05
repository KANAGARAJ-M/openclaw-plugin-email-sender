import { ImapFlow } from 'imapflow';
import { ImapConfig, ReadEmailsOptions, ExtractedEmail, OpenClawToolResult } from '../types';

export class ImapService {
  private config: ImapConfig | null = null;

  constructor(config?: ImapConfig) {
    if (config) {
      this.configure(config);
    }
  }

  public configure(config: ImapConfig): void {
    this.config = config;
  }

  private createClient(): ImapFlow {
    if (!this.config) {
      throw new Error('IMAP is not configured.');
    }

    const auth = this.config.auth.type === 'basic'
      ? { user: this.config.auth.user, pass: this.config.auth.pass }
      : {
          user: this.config.auth.user,
          accessToken: this.config.auth.accessToken || '',
        };

    return new ImapFlow({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure ?? true,
      auth,
      tls: {
        rejectUnauthorized: this.config.tlsOptions?.rejectUnauthorized ?? true,
      },
      logger: false,
    });
  }

  public async verifyConnection(): Promise<OpenClawToolResult<{ verified: boolean; host?: string; port?: number }>> {
    if (!this.config) {
      return {
        success: false,
        message: 'IMAP configuration is missing.',
        error: 'CONFIG_MISSING',
      };
    }

    const client = this.createClient();
    try {
      await client.connect();
      const status = await client.status('INBOX', { unseen: true, messages: true });
      await client.logout();

      return {
        success: true,
        message: `Successfully connected to IMAP server at ${this.config.host}:${this.config.port} (INBOX has ${status.messages} messages, ${status.unseen} unseen)`,
        data: {
          verified: true,
          host: this.config.host,
          port: this.config.port,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: `IMAP connection verification failed: ${err.message}`,
        error: err.message,
      };
    }
  }

  public async readEmails(options: ReadEmailsOptions = {}): Promise<OpenClawToolResult<ExtractedEmail[]>> {
    if (!this.config) {
      return {
        success: false,
        message: 'IMAP service is not configured.',
        error: 'CONFIG_MISSING',
      };
    }

    const targetMailbox = options.mailbox || this.config.defaultMailbox || 'INBOX';
    const limit = options.limit || 10;
    const client = this.createClient();

    try {
      await client.connect();
      const lock = await client.getMailboxLock(targetMailbox);

      try {
        const searchQuery: any = {};

        if (options.unreadOnly) {
          searchQuery.seen = false;
        }

        if (options.sinceDate) {
          searchQuery.since = new Date(options.sinceDate);
        }

        if (options.fromAddress) {
          searchQuery.from = options.fromAddress;
        }

        if (options.subjectSearch) {
          searchQuery.subject = options.subjectSearch;
        }

        // Fetch matching messages
        const messages: ExtractedEmail[] = [];
        const mailboxExists = (client.mailbox && typeof client.mailbox === 'object' && 'exists' in client.mailbox) ? client.mailbox.exists : 10;
        const fetchRange = searchQuery.seen === false ? '1:*' : `${Math.max(1, mailboxExists - limit + 1)}:*`;

        for await (const message of client.fetch(fetchRange, {
          envelope: true,
          flags: true,
          bodyStructure: true,
          source: false,
        }, { uid: false })) {

          const flags = message.flags || new Set<string>();
          const envelope = message.envelope || {
            subject: '(No Subject)',
            from: [],
            to: [],
            cc: [],
            date: new Date(),
          };

          // Filter manually if search criteria present
          if (options.unreadOnly && flags.has('\\Seen')) {
            continue;
          }

          if (options.subjectSearch && !envelope.subject?.toLowerCase().includes(options.subjectSearch.toLowerCase())) {
            continue;
          }

          if (options.fromAddress && !envelope.from?.some(f => f.address?.toLowerCase().includes(options.fromAddress!.toLowerCase()))) {
            continue;
          }

          const fromAddr = envelope.from?.[0]
            ? { address: envelope.from[0].address || '', name: envelope.from[0].name || '' }
            : { address: 'unknown', name: '' };

          const toAddrs = (envelope.to || []).map((t) => ({
            address: t.address || '',
            name: t.name || '',
          }));

          const ccAddrs = (envelope.cc || []).map((c) => ({
            address: c.address || '',
            name: c.name || '',
          }));

          const extractedMsg: ExtractedEmail = {
            id: message.seq,
            uid: message.uid,
            messageId: envelope.messageId,
            subject: envelope.subject || '(No Subject)',
            from: fromAddr,
            to: toAddrs,
            cc: ccAddrs,
            date: envelope.date ? envelope.date.toISOString() : new Date().toISOString(),
            flags: Array.from(flags),
            attachmentsCount: message.bodyStructure?.childNodes?.length ? message.bodyStructure.childNodes.length - 1 : 0,
          };

          if (options.markAsRead && !flags.has('\\Seen')) {
            await client.messageFlagsAdd(message.seq.toString(), ['\\Seen']);
          }

          messages.push(extractedMsg);

          if (messages.length >= limit) {
            break;
          }
        }

        // Sort descending by date
        messages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return {
          success: true,
          message: `Retrieved ${messages.length} email(s) from mailbox "${targetMailbox}"`,
          data: messages,
        };
      } finally {
        lock.release();
      }
    } catch (err: any) {
      return {
        success: false,
        message: `Failed to fetch emails: ${err.message}`,
        error: err.message,
      };
    } finally {
      await client.logout().catch(() => {});
    }
  }

  public isConfigured(): boolean {
    return this.config !== null;
  }
}
