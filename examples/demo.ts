import nodemailer from 'nodemailer';
import { OpenClawEmailSenderPlugin } from '../src';

async function runDemo() {
  console.log('--------------------------------------------------');
  console.log('  OpenClaw Email Sender Plugin - Demo & Test Tool');
  console.log('--------------------------------------------------\n');

  console.log('1. Creating auto-generated Ethereal Test Account for live SMTP test...');
  const testAccount = await nodemailer.createTestAccount();
  console.log(`   User: ${testAccount.user}`);
  console.log(`   Host: ${testAccount.smtp.host}:${testAccount.smtp.port}\n`);

  // Initialize plugin with Ethereal SMTP account
  const plugin = new OpenClawEmailSenderPlugin({
    smtp: {
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        type: 'basic',
        user: testAccount.user,
        pass: testAccount.pass,
      },
      fromName: 'OpenClaw AI',
      fromAddress: testAccount.user,
    },
    templates: {
      inlineTemplates: {
        welcome: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #4f46e5;">Welcome to OpenClaw Automation, {{name}}!</h2>
            <p>Your request token is <code>{{token}}</code>.</p>
            <p>Sent at: {{formatDate date}}</p>
          </div>
        `,
      },
    },
  });

  const tools = plugin.getTools();
  console.log(`2. Registered Tools: ${tools.map((t) => t.definition.name).join(', ')}\n`);

  // 1. Verify Connection
  console.log('3. Running verify_email_connection tool...');
  const verifyTool = tools.find((t) => t.definition.name === 'verify_email_connection');
  const verifyResult = await verifyTool!.handler({ checkSmtp: true, checkImap: false });
  console.log('   Result:', JSON.stringify(verifyResult, null, 2), '\n');

  // 2. Render Template
  console.log('4. Running render_email_template tool...');
  const renderTool = tools.find((t) => t.definition.name === 'render_email_template');
  const renderResult = await renderTool!.handler({
    templateName: 'welcome',
    data: { name: 'Sarah Connor', token: 'TOKEN-9921', date: new Date().toISOString() },
  });
  console.log('   Rendered HTML snippet:\n', renderResult.data?.renderedOutput?.substring(0, 150) + '...\n');

  // 3. Send Email using Template
  console.log('5. Running send_email tool...');
  const sendTool = tools.find((t) => t.definition.name === 'send_email');
  const sendResult = await sendTool!.handler({
    to: ['test-recipient@example.com'],
    subject: 'OpenClaw Plugin Test Email',
    templateName: 'welcome',
    templateData: { name: 'Sarah Connor', token: 'TOKEN-9921', date: new Date().toISOString() },
  });
  console.log('   Send Result:', JSON.stringify(sendResult, null, 2), '\n');

  if (sendResult.success && sendResult.data?.messageId) {
    const previewUrl = nodemailer.getTestMessageUrl(sendResult.data as any);
    if (previewUrl) {
      console.log(`🌐 Live Email Preview URL (Ethereal Web Viewer): ${previewUrl}\n`);
    }
  }

  console.log('Demo completed successfully!');
}

runDemo().catch((err) => {
  console.error('Demo error:', err);
  process.exit(1);
});
