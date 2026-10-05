import Handlebars from 'handlebars';
import { TemplateConfig } from '../types';

export class TemplateService {
  private templates: Map<string, Handlebars.TemplateDelegate> = new Map();

  constructor(config: TemplateConfig = {}) {
    if (config.inlineTemplates) {
      this.registerInlineTemplates(config.inlineTemplates);
    }
    this.registerDefaultHelpers();
  }

  public registerTemplate(name: string, templateString: string): void {
    const compiled = Handlebars.compile(templateString);
    this.templates.set(name, compiled);
  }

  public registerInlineTemplates(templates: Record<string, string>): void {
    for (const [name, raw] of Object.entries(templates)) {
      this.registerTemplate(name, raw);
    }
  }

  public render(name: string, data: Record<string, any> = {}): string {
    const compiled = this.templates.get(name);
    if (!compiled) {
      throw new Error(`Template "${name}" is not registered. Available templates: [${Array.from(this.templates.keys()).join(', ')}]`);
    }
    return compiled(data);
  }

  public renderString(templateString: string, data: Record<string, any> = {}): string {
    const compiled = Handlebars.compile(templateString);
    return compiled(data);
  }

  public hasTemplate(name: string): boolean {
    return this.templates.has(name);
  }

  private registerDefaultHelpers(): void {
    Handlebars.registerHelper('uppercase', (str: string) => (str ? str.toUpperCase() : ''));
    Handlebars.registerHelper('lowercase', (str: string) => (str ? str.toLowerCase() : ''));
    Handlebars.registerHelper('formatDate', (dateStr: string) => {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString();
    });
  }
}
