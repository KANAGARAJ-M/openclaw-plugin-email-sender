import { TemplateService } from '../services/template.service';
import { OpenClawToolResult } from '../types';

export const createTemplateToolDefinition = {
  name: 'create_email_template',
  description: 'Create or register a custom reusable HTML email template dynamically in OpenClaw',
  parameters: {
    type: 'object',
    properties: {
      templateName: {
        type: 'string',
        description: 'Unique name identifier for the template (e.g., "monthly_report" or "client_followup")',
      },
      templateContent: {
        type: 'string',
        description: 'HTML string with optional Handlebars placeholders (e.g. <h1>Hello {{name}}</h1>)',
      },
      saveToDiskDir: {
        type: 'string',
        description: 'Optional folder path to persist the template file on disk (e.g. "./templates")',
      },
    },
    required: ['templateName', 'templateContent'],
  },
};

export function createCreateTemplateToolHandler(templateService: TemplateService) {
  return async (args: any): Promise<OpenClawToolResult> => {
    try {
      if (!args.templateName || !args.templateContent) {
        return {
          success: false,
          message: 'Both templateName and templateContent parameters are required.',
          error: 'MISSING_PARAMS',
        };
      }

      const res = templateService.createCustomTemplate(
        args.templateName,
        args.templateContent,
        args.saveToDiskDir
      );

      return {
        success: true,
        message: `Template "${res.name}" registered successfully.${
          res.savedPath ? ` Persisted to disk at ${res.savedPath}` : ''
        }`,
        data: {
          templateName: res.name,
          availableTemplates: templateService.getAvailableTemplates(),
          savedPath: res.savedPath,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Failed to create template: ${err.message}`,
        error: err.message,
      };
    }
  };
}
