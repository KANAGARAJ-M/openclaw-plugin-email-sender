import OpenClawEmailSenderPlugin from '../src/index';

describe('OpenClawEmailSenderPlugin', () => {
  it('should instantiate and export 4 OpenClaw tool definitions', () => {
    const plugin = new OpenClawEmailSenderPlugin({
      security: {
        allowedRecipientDomains: ['company.com'],
      },
      templates: {
        inlineTemplates: {
          testTmpl: 'Hello {{name}}',
        },
      },
    });

    const tools = plugin.getTools();
    expect(tools.length).toBe(4);

    const toolNames = tools.map((t) => t.definition.name);
    expect(toolNames).toContain('send_email');
    expect(toolNames).toContain('read_emails');
    expect(toolNames).toContain('verify_email_connection');
    expect(toolNames).toContain('render_email_template');
  });

  it('should render template via tool handler', async () => {
    const plugin = new OpenClawEmailSenderPlugin();
    plugin.registerTemplate('invoice', 'Invoice #{{id}} total ${{amount}}');

    const tools = plugin.getTools();
    const renderTool = tools.find((t) => t.definition.name === 'render_email_template');

    expect(renderTool).toBeDefined();
    const result = await renderTool!.handler({
      templateName: 'invoice',
      data: { id: '1001', amount: '250.00' },
    });

    expect(result.success).toBe(true);
    expect(result.data.renderedOutput).toBe('Invoice #1001 total $250.00');
  });

  it('should reject email via tool handler if security rule fails', async () => {
    const plugin = new OpenClawEmailSenderPlugin({
      smtp: {
        host: 'smtp.example.com',
        port: 587,
        auth: { type: 'basic', user: 'agent@company.com', pass: 'secret' },
      },
      security: {
        allowedRecipientDomains: ['company.com'],
      },
    });

    const tools = plugin.getTools();
    const sendTool = tools.find((t) => t.definition.name === 'send_email');

    const result = await sendTool!.handler({
      to: ['evil@unauthorized.com'],
      subject: 'Data Leak',
      text: 'Secret info',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('SECURITY_VIOLATION');
  });
});
