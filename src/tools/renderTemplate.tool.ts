import { TemplateService } from '../services/template.service';
import { OpenClawToolResult } from '../types';

export const renderTemplateToolDefinition = {
  name: 'render_email_template',
  description: 'Preview or render a Handlebars email template with dynamic variables',
  parameters: {
    type: 'object',
    properties: {
      templateName: {
        type: 'string',
        description: 'Name of a registered email template to render',
      },
      templateString: {
        type: 'string',
        description: 'Raw Handlebars template string to compile and render on-the-fly',
      },
      data: {
        type: 'object',
        description: 'Data variables to inject into template tags (e.g., {"name": "Alice"})',
      },
    },
  },
};

export function createRenderTemplateToolHandler(templateService: TemplateService) {
  return async (args: any): Promise<OpenClawToolResult> => {
    try {
      const data = args.data || {};
      let rendered: string;

      if (args.templateName) {
        rendered = templateService.render(args.templateName, data);
      } else if (args.templateString) {
        rendered = templateService.renderString(args.templateString, data);
      } else {
        return {
          success: false,
          message: 'Either templateName or templateString must be provided.',
          error: 'MISSING_PARAM',
        };
      }

      return {
        success: true,
        message: 'Template rendered successfully',
        data: {
          renderedOutput: rendered,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Template rendering failed: ${err.message}`,
        error: err.message,
      };
    }
  };
}
