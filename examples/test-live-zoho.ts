import dotenv from 'dotenv';
import { OpenClawEmailSenderPlugin } from '../src';

dotenv.config();

async function testLiveEmail() {
  console.log('--------------------------------------------------');
  console.log('  Live Email Test via Environment Variables');
  console.log('--------------------------------------------------\n');

  // If initialConfig is omitted or partial, plugin auto-loads from process.env
  const plugin = new OpenClawEmailSenderPlugin({
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.zoho.in',
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465,
      secure: process.env.SMTP_SECURE === 'true' || (!process.env.SMTP_SECURE && (parseInt(process.env.SMTP_PORT || '465', 10) === 465)),
      auth: {
        type: 'basic',
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
      fromName: process.env.SMTP_FROM_NAME || 'Your Business',
      fromAddress: process.env.SMTP_FROM_ADDRESS || process.env.SMTP_USER || '',
    },
  });

  const tools = plugin.getTools();
  
  // 1. Verify connection
  console.log('1. Testing SMTP Connection...');
  const verifyTool = tools.find((t) => t.definition.name === 'verify_email_connection');
  const verifyRes = await verifyTool!.handler({ checkSmtp: true, checkImap: false });
  console.log('   Connection Result:', JSON.stringify(verifyRes, null, 2), '\n');

  if (!verifyRes.success) {
    console.error('❌ Connection verification failed!');
    return;
  }

  // 2. Send email
  console.log('2. Sending test email...');
  const sendTool = tools.find((t) => t.definition.name === 'send_email');
  const sendRes = await sendTool!.handler({
    to: [process.env.TEST_RECIPIENT || 'your-email@example.com'],
    subject: 'OpenClaw Email Plugin Realtime Test',
    text: 'Hello, This is a test email sent via OpenClaw Email Sender Plugin.',
  });

  console.log('   Send Result:', JSON.stringify(sendRes, null, 2), '\n');
}

testLiveEmail().catch(console.error);
