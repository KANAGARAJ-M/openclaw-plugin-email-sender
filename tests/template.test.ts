import { TemplateService } from '../src/services/template.service';

describe('TemplateService & Preset Templates', () => {
  it('should render preset business template with data', () => {
    const service = new TemplateService();
    const output = service.render('business', {
      companyName: 'Nocorps Business',
      title: 'Quarterly Project Update',
      recipientName: 'Alex',
      messageBody: '<p>All milestones completed on time.</p>',
      actionUrl: 'https://nocorps.in/dashboard',
      actionText: 'Open Dashboard',
    });

    expect(output).toContain('Nocorps Business');
    expect(output).toContain('Quarterly Project Update');
    expect(output).toContain('Open Dashboard');
  });

  it('should render preset quotation template with itemized table', () => {
    const service = new TemplateService();
    const output = service.render('quotation', {
      quoteNumber: 'Q-2026-089',
      customerName: 'Acme Corp',
      items: [
        { description: 'Cloud Automation Setup', qty: 1, unitPrice: 25000, total: 25000 },
        { description: 'OpenClaw Email Sender Plugin', qty: 1, unitPrice: 15000, total: 15000 },
      ],
      subtotal: '40000',
      tax: '7200',
      grandTotal: '47200',
      currencySymbol: '₹',
    });

    expect(output).toContain('QUOTATION');
    expect(output).toContain('Q-2026-089');
    expect(output).toContain('Cloud Automation Setup');
    expect(output).toContain('₹47200');
  });

  it('should render preset enquiry template', () => {
    const service = new TemplateService();
    const output = service.render('enquiry', {
      enquiryId: 'ENQ-991',
      customerName: 'Rohan',
      enquirySubject: 'Pricing enquiry for custom agent',
      responseMessage: 'Our standard package starts at ₹10,000.',
    });

    expect(output).toContain('ENQ-991');
    expect(output).toContain('Pricing enquiry for custom agent');
    expect(output).toContain('Our standard package starts at ₹10,000');
  });

  it('should allow user to create custom template at runtime', () => {
    const service = new TemplateService();
    const res = service.createCustomTemplate('newsletter', '<h1>{{title}}</h1><p>{{content}}</p>');

    expect(res.name).toBe('newsletter');
    expect(service.hasTemplate('newsletter')).toBe(true);

    const rendered = service.render('newsletter', {
      title: 'October Digest',
      content: 'Here are the updates...',
    });

    expect(rendered).toBe('<h1>October Digest</h1><p>Here are the updates...</p>');
  });
});
