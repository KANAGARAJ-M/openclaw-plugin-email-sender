import { SmtpService } from '../services/smtp.service';
import { ImapService } from '../services/imap.service';
import { OpenClawToolResult } from '../types';

export const verifyConnectionToolDefinition = {
  name: 'verify_email_connection',
  description: 'Verify connectivity and authentication for configured SMTP and IMAP servers',
  parameters: {
    type: 'object',
    properties: {
      checkSmtp: {
        type: 'boolean',
        description: 'Test SMTP server connection (default: true)',
      },
      checkImap: {
        type: 'boolean',
        description: 'Test IMAP server connection (default: true)',
      },
    },
  },
};

export function createVerifyConnectionToolHandler(
  smtpService: SmtpService,
  imapService: ImapService
) {
  return async (args: any = {}): Promise<OpenClawToolResult> => {
    const checkSmtp = args.checkSmtp ?? true;
    const checkImap = args.checkImap ?? true;

    const results: any = {};
    let overallSuccess = true;

    if (checkSmtp) {
      if (smtpService.isConfigured()) {
        const smtpRes = await smtpService.verifyConnection();
        results.smtp = smtpRes;
        if (!smtpRes.success) overallSuccess = false;
      } else {
        results.smtp = { success: false, message: 'SMTP is not configured.' };
      }
    }

    if (checkImap) {
      if (imapService.isConfigured()) {
        const imapRes = await imapService.verifyConnection();
        results.imap = imapRes;
        if (!imapRes.success) overallSuccess = false;
      } else {
        results.imap = { success: false, message: 'IMAP is not configured.' };
      }
    }

    return {
      success: overallSuccess,
      message: overallSuccess
        ? 'Email service connectivity check passed successfully.'
        : 'One or more email service connection tests failed.',
      data: results,
    };
  };
}
