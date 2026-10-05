import OpenClawEmailSenderPlugin from '../src/index';

describe('OpenClawEmailSenderPlugin Tools', () => {
  it('should instantiate and export 5 OpenClaw tool definitions', () => {
    const plugin = new OpenClawEmailSenderPlugin({
      security: {
        allowedRecipientDomains: ['company.com'],
      },
    });

    const tools = plugin.getTools();
    expect(tools.length).toBe(5);

    const toolNames = tools.map((t) => t.definition.name);
    expect(toolNames).toContain('send_email');
    expect(toolNames).toContain('read_emails');
    expect(toolNames).toContain('verify_email_connection');
    expect(toolNames).toContain('render_email_template');
    expect(toolNames).toContain('create_email_template');
  });

  it('should create new custom template via create_email_template tool handler', async () => {
    const plugin = new OpenClawEmailSenderPlugin();
    const tools = plugin.getTools();

    const createTool = tools.find((t) => t.definition.name === 'create_email_template');
    const renderTool = tools.find((t) => t.definition.name === 'render_email_template');

    expect(createTool).toBeDefined();

    // 1. Create custom template
    const createRes = await createTool!.handler({
      templateName: 'promo_discount',
      templateContent: '<h2>Special {{discount}}% Off!</h2><p>Use code {{code}}</p>',
    });

    expect(createRes.success).toBe(true);

    // 2. Render created template
    const renderRes = await renderTool!.handler({
      templateName: 'promo_discount',
      data: { discount: '20', code: 'AUTUMN20' },
    });

    expect(renderRes.success).toBe(true);
    expect(renderRes.data.renderedOutput).toBe('<h2>Special 20% Off!</h2><p>Use code AUTUMN20</p>');
  });
});
