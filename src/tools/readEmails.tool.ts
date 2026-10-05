import { ImapService } from '../services/imap.service';
import { ReadEmailsOptions, OpenClawToolResult } from '../types';

export const readEmailsToolDefinition = {
  name: 'read_emails',
  description: 'Fetch and search emails from an IMAP mailbox inbox',
  parameters: {
    type: 'object',
    properties: {
      mailbox: {
        type: 'string',
        description: 'Mailbox name to read from (default: "INBOX")',
      },
      unreadOnly: {
        type: 'boolean',
        description: 'If true, only fetch unread emails',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of emails to return (default: 10, max: 50)',
      },
      sinceDate: {
        type: 'string',
        description: 'ISO date string to filter messages since (e.g., "2026-10-01")',
      },
      fromAddress: {
        type: 'string',
        description: 'Filter emails by sender address pattern',
      },
      subjectSearch: {
        type: 'string',
        description: 'Filter emails by subject keyword',
      },
      markAsRead: {
        type: 'boolean',
        description: 'If true, mark fetched emails as read (\\Seen flag)',
      },
    },
  },
};

export function createReadEmailsToolHandler(imapService: ImapService) {
  return async (args: any = {}): Promise<OpenClawToolResult> => {
    try {
      const options: ReadEmailsOptions = {
        mailbox: args.mailbox || 'INBOX',
        unreadOnly: args.unreadOnly ?? false,
        limit: Math.min(args.limit || 10, 50),
        sinceDate: args.sinceDate,
        fromAddress: args.fromAddress,
        subjectSearch: args.subjectSearch,
        markAsRead: args.markAsRead ?? false,
      };

      return await imapService.readEmails(options);
    } catch (err: any) {
      return {
        success: false,
        message: `Error executing read_emails tool: ${err.message}`,
        error: err.message,
      };
    }
  };
}
