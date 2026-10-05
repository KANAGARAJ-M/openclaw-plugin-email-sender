export * from './types';
export * from './config/schema';
export * from './security/allowlist';
export * from './templates/presetTemplates';
export * from './services/template.service';
export * from './services/smtp.service';
export * from './services/imap.service';
export * from './tools/sendEmail.tool';
export * from './tools/readEmails.tool';
export * from './tools/verifyConnection.tool';
export * from './tools/renderTemplate.tool';
export * from './tools/createTemplate.tool';
export * from './plugin';

import { OpenClawEmailSenderPlugin } from './plugin';
export default OpenClawEmailSenderPlugin;
