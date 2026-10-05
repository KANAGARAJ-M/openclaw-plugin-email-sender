import { TemplateService } from '../src/services/template.service';

describe('TemplateService', () => {
  it('should compile and render registered template with data', () => {
    const service = new TemplateService({
      inlineTemplates: {
        welcome: '<h1>Hello {{name}}!</h1><p>Your OTP is {{otp}}</p>',
      },
    });

    const output = service.render('welcome', { name: 'Alex', otp: '123456' });
    expect(output).toBe('<h1>Hello Alex!</h1><p>Your OTP is 123456</p>');
  });

  it('should render raw template strings on the fly', () => {
    const service = new TemplateService();
    const output = service.renderString('System alert: {{uppercase level}} - {{message}}', {
      level: 'critical',
      message: 'Server disk space high',
    });

    expect(output).toBe('System alert: CRITICAL - Server disk space high');
  });

  it('should throw error when rendering non-existent template name', () => {
    const service = new TemplateService();
    expect(() => service.render('non_existent')).toThrow('Template "non_existent" is not registered');
  });
});
