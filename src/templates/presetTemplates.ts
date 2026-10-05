export const PRESET_TEMPLATES: Record<string, string> = {
  // 1. Business Template
  business: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 25px 30px; text-align: left;">
              <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">
                {{#if companyName}}{{companyName}}{{else}}Nocorps Business{{/if}}
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #0f172a; margin-top: 0; font-size: 18px;">{{title}}</h2>
              <p style="font-size: 15px; color: #334155; line-height: 1.6;">
                Dear {{#if recipientName}}{{recipientName}}{{else}}Valued Partner{{/if}},
              </p>
              <div style="font-size: 14px; color: #475569; line-height: 1.7; margin: 20px 0;">
                {{{messageBody}}}
              </div>
              {{#if actionUrl}}
              <div style="margin: 30px 0; text-align: center;">
                <a href="{{actionUrl}}" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; display: inline-block;">
                  {{#if actionText}}{{actionText}}{{else}}View Details{{/if}}
                </a>
              </div>
              {{/if}}
              <p style="font-size: 14px; color: #475569; margin-top: 30px; line-height: 1.5;">
                Best regards,<br>
                <strong>{{#if senderName}}{{senderName}}{{else}}Business Operations{{/if}}</strong><br>
                <span style="color: #64748b; font-size: 13px;">{{#if senderTitle}}{{senderTitle}}{{else}}Nocorps Team{{/if}}</span>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 15px 30px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
              &copy; {{#if year}}{{year}}{{else}}2026{{/if}} {{#if companyName}}{{companyName}}{{else}}Nocorps{{/if}}. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,

  // 2. General Announcement Template
  general: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{subject}}</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f1f5f9; color: #334155;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding: 25px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; border: 1px solid #cbd5e1; padding: 30px;">
          <tr>
            <td>
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; margin-bottom: 20px;">
                <span style="font-size: 12px; font-weight: bold; color: #1d4ed8; text-transform: uppercase;">
                  {{#if category}}{{uppercase category}}{{else}}ANNOUNCEMENT{{/if}}
                </span>
              </div>
              <h2 style="color: #1e293b; margin-top: 0;">{{title}}</h2>
              <p style="font-size: 14px; color: #475569; line-height: 1.6;">
                {{{message}}}
              </p>
              {{#if footerNote}}
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                {{footerNote}}
              </p>
              {{/if}}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,

  // 3. Enquiry / Support Response Template
  enquiry: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enquiry Response - {{enquiryId}}</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
          <tr style="background-color: #0284c7; color: #ffffff;">
            <td style="padding: 20px 30px;">
              <h2 style="margin: 0; font-size: 18px;">Enquiry Ticket #{{#if enquiryId}}{{enquiryId}}{{else}}REQ-1001{{/if}}</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 15px; color: #334155;">
                Hello {{#if customerName}}{{customerName}}{{else}}Customer{{/if}},
              </p>
              <p style="font-size: 14px; color: #475569; line-height: 1.6;">
                Thank you for reaching out to us regarding <strong>"{{#if enquirySubject}}{{enquirySubject}}{{else}}your enquiry{{/if}}"</strong>.
              </p>
              <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; border-left: 3px solid #0284c7; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.6;">
                  {{{responseMessage}}}
                </p>
              </div>
              <p style="font-size: 14px; color: #475569; line-height: 1.6;">
                If you have further questions or additional details to share, simply reply to this email.
              </p>
              <p style="font-size: 14px; color: #475569; margin-top: 25px;">
                Best Regards,<br>
                <strong>{{#if agentName}}{{agentName}}{{else}}Customer Support Team{{/if}}</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,

  // 4. Professional Quotation / Price Estimate Template
  quotation: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quotation #{{quoteNumber}}</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 650px; background-color: #ffffff; border-radius: 8px; border: 1px solid #cbd5e1; overflow: hidden;">
          <!-- Header -->
          <tr style="background-color: #0f172a; color: #ffffff;">
            <td style="padding: 25px 30px;">
              <table width="100%">
                <tr>
                  <td>
                    <h2 style="margin: 0; font-size: 20px; color: #ffffff;">QUOTATION</h2>
                    <p style="margin: 5px 0 0 0; font-size: 13px; color: #94a3b8;">Quote #: {{quoteNumber}}</p>
                  </td>
                  <td align="right" style="font-size: 13px; color: #cbd5e1;">
                    Date: {{#if quoteDate}}{{quoteDate}}{{else}}05 Oct 2026{{/if}}<br>
                    Valid Until: {{#if validUntil}}{{validUntil}}{{else}}30 Days{{/if}}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Client & Business Info -->
          <tr>
            <td style="padding: 25px 30px;">
              <table width="100%">
                <tr>
                  <td width="50%" valign="top" style="font-size: 13px; color: #475569;">
                    <strong style="color: #0f172a; font-size: 14px;">PREPARED FOR:</strong><br>
                    {{#if customerName}}{{customerName}}{{else}}Client Name{{/if}}<br>
                    {{#if customerCompany}}{{customerCompany}}{{/if}}<br>
                    {{#if customerEmail}}{{customerEmail}}{{/if}}
                  </td>
                  <td width="50%" valign="top" align="right" style="font-size: 13px; color: #475569;">
                    <strong style="color: #0f172a; font-size: 14px;">PREPARED BY:</strong><br>
                    {{#if providerName}}{{providerName}}{{else}}Nocorps Solutions{{/if}}<br>
                    {{#if providerEmail}}{{providerEmail}}{{else}}business@nocorps.in{{/if}}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 0 30px;">
              <table width="100%" cellspacing="0" cellpadding="10" style="border-collapse: collapse; font-size: 13px;">
                <thead>
                  <tr style="background-color: #f1f5f9; color: #0f172a; text-align: left;">
                    <th style="border-bottom: 2px solid #cbd5e1; padding: 10px;">Item Description</th>
                    <th style="border-bottom: 2px solid #cbd5e1; padding: 10px;" align="center">Qty</th>
                    <th style="border-bottom: 2px solid #cbd5e1; padding: 10px;" align="right">Unit Price</th>
                    <th style="border-bottom: 2px solid #cbd5e1; padding: 10px;" align="right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {{#each items}}
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 10px; color: #334155;">{{this.description}}</td>
                    <td style="padding: 10px; color: #334155;" align="center">{{this.qty}}</td>
                    <td style="padding: 10px; color: #334155;" align="right">{{#if ../currencySymbol}}{{../currencySymbol}}{{else}}₹{{/if}}{{this.unitPrice}}</td>
                    <td style="padding: 10px; color: #0f172a; font-weight: 600;" align="right">{{#if ../currencySymbol}}{{../currencySymbol}}{{else}}₹{{/if}}{{this.total}}</td>
                  </tr>
                  {{/each}}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totals Breakdown -->
          <tr>
            <td style="padding: 20px 30px;">
              <table width="100%" style="font-size: 14px;">
                {{#if subtotal}}
                <tr>
                  <td align="right" style="color: #64748b;">Subtotal:</td>
                  <td align="right" width="120" style="color: #334155; font-weight: 500;">{{#if currencySymbol}}{{currencySymbol}}{{else}}₹{{/if}}{{subtotal}}</td>
                </tr>
                {{/if}}
                {{#if tax}}
                <tr>
                  <td align="right" style="color: #64748b;">Tax / GST:</td>
                  <td align="right" style="color: #334155; font-weight: 500;">{{#if currencySymbol}}{{currencySymbol}}{{else}}₹{{/if}}{{tax}}</td>
                </tr>
                {{/if}}
                <tr>
                  <td align="right" style="color: #0f172a; font-weight: bold; font-size: 16px; padding-top: 10px;">Grand Total:</td>
                  <td align="right" style="color: #2563eb; font-weight: bold; font-size: 18px; padding-top: 10px;">{{#if currencySymbol}}{{currencySymbol}}{{else}}₹{{/if}}{{grandTotal}}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Payment Terms / Actions -->
          {{#if paymentTerms}}
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 30px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #475569;">
              <strong>Payment Terms & Notes:</strong><br>
              {{paymentTerms}}
            </td>
          </tr>
          {{/if}}

          {{#if acceptUrl}}
          <tr>
            <td align="center" style="padding: 20px 30px;">
              <a href="{{acceptUrl}}" style="background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">
                Accept & Proceed
              </a>
            </td>
          </tr>
          {{/if}}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,

  // 5. Welcome / Onboarding Template
  welcome: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to {{serviceName}}</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; border: 1px solid #e2e8f0; padding: 35px;">
          <tr>
            <td align="center">
              <h1 style="color: #4f46e5; margin-top: 0;">Welcome, {{name}}! 👋</h1>
              <p style="font-size: 15px; color: #475569; line-height: 1.6; text-align: center;">
                We are excited to have you on board with <strong>{{#if serviceName}}{{serviceName}}{{else}}our platform{{/if}}</strong>.
              </p>
              {{#if loginUrl}}
              <div style="margin: 30px 0;">
                <a href="{{loginUrl}}" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">
                  Get Started Now
                </a>
              </div>
              {{/if}}
              <p style="font-size: 13px; color: #64748b; text-align: center; margin-top: 25px;">
                If you have any questions, reach out to <a href="mailto:{{#if supportEmail}}{{supportEmail}}{{else}}support@nocorps.in{{/if}}" style="color: #4f46e5;">{{#if supportEmail}}{{supportEmail}}{{else}}support@nocorps.in{{/if}}</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `,
};
