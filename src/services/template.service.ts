import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { TemplateConfig } from '../types';
import { PRESET_TEMPLATES } from '../templates/presetTemplates';

export class TemplateService {
  private templates: Map<string, Handlebars.TemplateDelegate> = new Map();
  private templateRawSources: Map<string, string> = new Map();

  constructor(config: TemplateConfig = {}) {
    // 1. Register preset templates automatically
    this.registerPresetTemplates();

    // 2. Register inline custom templates if passed in config
    if (config.inlineTemplates) {
      this.registerInlineTemplates(config.inlineTemplates);
    }

    this.registerDefaultHelpers();
  }

  private registerPresetTemplates(): void {
    for (const [name, rawHtml] of Object.entries(PRESET_TEMPLATES)) {
      this.registerTemplate(name, rawHtml);
    }
  }

  public registerTemplate(name: string, templateString: string): void {
    const compiled = Handlebars.compile(templateString);
    this.templates.set(name.toLowerCase(), compiled);
    this.templateRawSources.set(name.toLowerCase(), templateString);
  }

  public registerInlineTemplates(templates: Record<string, string>): void {
    for (const [name, raw] of Object.entries(templates)) {
      this.registerTemplate(name, raw);
    }
  }

  /**
   * Dynamically register and optionally persist a custom template to disk
   */
  public createCustomTemplate(
    name: string,
    templateContent: string,
    saveToDiskDir?: string
  ): { name: string; savedPath?: string } {
    const normalizedName = name.toLowerCase().trim();
    this.registerTemplate(normalizedName, templateContent);

    let savedPath: string | undefined = undefined;

    if (saveToDiskDir) {
      if (!fs.existsSync(saveToDiskDir)) {
        fs.mkdirSync(saveToDiskDir, { recursive: true });
      }
      const filePath = path.join(saveToDiskDir, `${normalizedName}.hbs`);
      fs.writeFileSync(filePath, templateContent, 'utf-8');
      savedPath = filePath;
    }

    return {
      name: normalizedName,
      savedPath,
    };
  }

  public render(name: string, data: Record<string, any> = {}): string {
    const key = name.toLowerCase().trim();
    const compiled = this.templates.get(key);
    if (!compiled) {
      throw new Error(
        `Template "${name}" is not registered. Available templates: [${Array.from(
          this.templates.keys()
        ).join(', ')}]`
      );
    }
    return compiled(data);
  }

  public renderString(templateString: string, data: Record<string, any> = {}): string {
    const compiled = Handlebars.compile(templateString);
    return compiled(data);
  }

  public hasTemplate(name: string): boolean {
    return this.templates.has(name.toLowerCase().trim());
  }

  public getAvailableTemplates(): string[] {
    return Array.from(this.templates.keys());
  }

  public getTemplateSource(name: string): string | undefined {
    return this.templateRawSources.get(name.toLowerCase().trim());
  }

  private registerDefaultHelpers(): void {
    Handlebars.registerHelper('uppercase', (str: string) => (str ? String(str).toUpperCase() : ''));
    Handlebars.registerHelper('lowercase', (str: string) => (str ? String(str).toLowerCase() : ''));
    Handlebars.registerHelper('formatDate', (dateStr: string) => {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString();
    });
  }
}
