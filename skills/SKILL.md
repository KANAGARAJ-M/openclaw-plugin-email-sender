---
name: email-sender-skill
description: Comprehensive email communication skill for OpenClaw AI Assistant. Enables sending business emails, itemized quotations, reading inbox inquiries, and managing custom HTML templates via SMTP and IMAP.
metadata:
  openclaw:
    category: communication
    version: 1.0.0
    requires:
      plugins:
        - openclaw-plugin-email-sender
    tools:
      - send_email
      - read_emails
      - verify_email_connection
      - render_email_template
      - create_email_template
---

# OpenClaw Email Sender Skill

This skill teaches the OpenClaw AI Assistant how to perform end-to-end email automation tasks using the `openclaw-plugin-email-sender` plugin.

## 🎯 Capability Overview

1. **Email Sending (SMTP)**: Dispatch professional plain text and HTML emails, attachments, CC/BCC, and Reply-To headers.
2. **Inbox Operations (IMAP)**: Search unread emails, filter by sender/subject/date, and extract message content.
3. **Quotation & Proposal Generation**: Render itemized price estimates with subtotal, GST/tax, and CTA buttons using prebuilt templates.
4. **Custom Template Creation**: Dynamically design, register, and save new Handlebars email templates at runtime.
5. **Connectivity Diagnostics**: Verify SMTP and IMAP connection health.

---

## 🛠️ Available Tools Reference

### 1. `send_email`
Dispatches an email via SMTP.
* **Parameters**:
  * `to` (`string[]`): Array of recipient email addresses.
  * `subject` (`string`): Email subject line.
  * `text` (`string`, optional): Plain text body.
  * `html` (`string`, optional): HTML body.
  * `templateName` (`string`, optional): Prebuilt or registered template (`"business"`, `"quotation"`, `"enquiry"`, `"welcome"`, `"general"`).
  * `templateData` (`object`, optional): Key-value pairs injected into template variables.
  * `attachments` (`array`, optional): Attachment objects `{ filename, content, encoding, path }`.

### 2. `read_emails`
Fetches and searches inbox messages via IMAP.
* **Parameters**:
  * `mailbox` (`string`, optional): Folder name (default: `"INBOX"`).
  * `unreadOnly` (`boolean`, optional): Set `true` to fetch only unread messages.
  * `limit` (`number`, optional): Max number of messages (default: 10).
  * `sinceDate` (`string`, optional): ISO date string filter.
  * `subjectSearch` (`string`, optional): Subject keyword.
  * `fromAddress` (`string`, optional): Sender email pattern.
  * `markAsRead` (`boolean`, optional): Set `true` to mark returned emails as `\Seen`.

### 3. `create_email_template`
Registers a new Handlebars HTML template dynamically.
* **Parameters**:
  * `templateName` (`string`): Unique template name.
  * `templateContent` (`string`): HTML content with `{{variable}}` placeholders.
  * `saveToDiskDir` (`string`, optional): Directory path to persist `.hbs` file.

### 4. `render_email_template`
Previews or renders a registered or raw template string with data.

### 5. `verify_email_connection`
Checks SMTP and IMAP authentication and connectivity status.

---

## 📋 Standard Operating Workflows

### Workflow 1: Sending a Professional Business Communication
When the user asks to send an official update, proposal, or announcement:
1. Verify recipient address formatting.
2. Select the `"business"` template.
3. Pass `companyName`, `title`, `recipientName`, `messageBody`, `actionUrl`, and `senderName` into `templateData`.
4. Call `send_email`.

### Workflow 2: Sending an Itemized Price Quotation
When the user requests a price quote or estimate:
1. Gather client details and line items (description, quantity, unit price).
2. Calculate total per item, subtotal, tax/GST, and grand total.
3. Call `send_email` using `templateName: "quotation"`.

### Workflow 3: Processing Unread Customer Inquiries
When asked to check and respond to incoming email queries:
1. Call `read_emails` with `unreadOnly: true` and `markAsRead: false`.
2. Analyze the sender's question.
3. Draft a response using `templateName: "enquiry"`.
4. Call `send_email` and mark the original email as read.

---

## 🔒 Security Guidelines

- Always honor recipient domain allowlists (`allowedRecipientDomains`).
- Never expose raw credentials or passwords in email bodies.
- Verify attachment sizes stay below safety thresholds (25 MB).
