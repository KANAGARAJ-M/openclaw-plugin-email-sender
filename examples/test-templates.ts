import { OpenClawEmailSenderPlugin } from '../src';

async function runTemplatesDemo() {
  console.log('==================================================');
  console.log(' OpenClaw Email Sender Plugin - Templates Demo');
  console.log('==================================================\n');

  const plugin = new OpenClawEmailSenderPlugin();
  const tools = plugin.getTools();
  const renderTool = tools.find((t) => t.definition.name === 'render_email_template')!;
  const createTool = tools.find((t) => t.definition.name === 'create_email_template')!;

  // 1. Business Template
  console.log('1. Rendering "business" template...');
  const businessRes = await renderTool.handler({
    templateName: 'business',
    data: {
      companyName: 'Nocorps Technology',
      title: 'Strategic Partnership Proposal',
      recipientName: 'Mr. Kanagaraj',
      messageBody: '<p>We are excited to submit our enterprise solution proposal for OpenClaw automation integration.</p>',
      actionUrl: 'https://nocorps.in/proposal/101',
      actionText: 'Review Proposal Online',
      senderName: 'Kanagaraj M',
      senderTitle: 'Founder & CEO',
    },
  });
  console.log('   Rendered HTML length:', businessRes.data.renderedOutput.length, 'bytes\n');

  // 2. Quotation Template
  console.log('2. Rendering "quotation" template...');
  const quoteRes = await renderTool.handler({
    templateName: 'quotation',
    data: {
      quoteNumber: 'QT-2026-99',
      quoteDate: '05 October 2026',
      validUntil: '04 November 2026',
      customerName: 'Nocorps Admin',
      providerName: 'Nocorps Technology',
      currencySymbol: '₹',
      items: [
        { description: 'OpenClaw Custom SMTP/IMAP Plugin Development', qty: 1, unitPrice: 25000, total: 25000 },
        { description: 'Handlebars Business Email Templates', qty: 5, unitPrice: 2000, total: 10000 },
        { description: 'Security Allowlisting & Rate Limiting Module', qty: 1, unitPrice: 10000, total: 10000 },
      ],
      subtotal: '45000',
      tax: '8100',
      grandTotal: '53100',
      paymentTerms: '50% advance upon PO, 50% upon delivery.',
      acceptUrl: 'https://nocorps.in/quote/accept?id=QT-2026-99',
    },
  });
  console.log('   Rendered HTML length:', quoteRes.data.renderedOutput.length, 'bytes\n');

  // 3. Enquiry Response Template
  console.log('3. Rendering "enquiry" template...');
  const enquiryRes = await renderTool.handler({
    templateName: 'enquiry',
    data: {
      enquiryId: 'ENQ-8842',
      customerName: 'Suresh Kumar',
      enquirySubject: 'IMAP & OAuth2 Support Details',
      responseMessage: 'Our plugin natively supports IMAPFlow inbox fetching as well as OAuth2 refresh tokens for Gmail & Outlook.',
      agentName: 'Nocorps Technical Support',
    },
  });
  console.log('   Rendered HTML length:', enquiryRes.data.renderedOutput.length, 'bytes\n');

  // 4. Create Custom User Template dynamically
  console.log('4. Creating Custom User Template via create_email_template tool...');
  const customCreateRes = await createTool.handler({
    templateName: 'custom_invoice',
    templateContent: `
      <div style="font-family: sans-serif; padding: 20px; border: 2px solid #2563eb;">
        <h2>Custom Invoice #{{invoiceNo}}</h2>
        <p>Dear {{client}}, total due is <strong>\${{totalAmount}}</strong>.</p>
      </div>
    `,
  });
  console.log('   Create Result:', customCreateRes.message);

  // 5. Render Newly Created Custom Template
  console.log('\n5. Rendering newly created "custom_invoice" template...');
  const customRenderRes = await renderTool.handler({
    templateName: 'custom_invoice',
    data: { invoiceNo: 'INV-7711', client: 'Alpha Corp', totalAmount: '1,250.00' },
  });
  console.log('   Output:\n', customRenderRes.data.renderedOutput.trim(), '\n');

  console.log('All preset and user-created templates tested successfully!');
}

runTemplatesDemo().catch(console.error);
