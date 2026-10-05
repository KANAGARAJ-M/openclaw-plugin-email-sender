# OpenClaw Email Sender Plugin (`openclaw-plugin-email-sender`)

A robust, enterprise-ready **SMTP & IMAP Plugin for OpenClaw AI Assistant**. OpenClaw natively supports IMAP reading; this plugin adds full **SMTP Email Sending Capabilities**, **Handlebars Templating**, **Security Allowlisting & Rate Limiting**, and **OAuth2 / App Password Authentication**.

---

## 🌟 Key Features

* **SMTP Email Sending**: Send plain-text or rich HTML emails, attachments (base64/local paths), custom headers, CC/BCC, and custom `Reply-To`.
* **IMAP Email Inbox Integration**: Search, filter, and fetch emails from mailboxes with unread filtering, date constraints, and flag management.
* **Security & Compliance Controls**:
  * **Recipient Allowlisting**: Restrict email sending strictly to authorized domain names (e.g. `company.com`).
  * **Recipient Blocklist**: Prevent sending emails to forbidden addresses or spam traps.
  * **Rate Limiting**: Configurable maximum emails dispatched per hour.
  * **Attachment Size Guard**: Prevents sending attachments exceeding allowed size thresholds (default 25 MB).
* **Template Engine**: Built-in Handlebars support with custom helpers (`uppercase`, `formatDate`) for dynamic HTML transaction emails.
* **OAuth2 & Basic Auth**: Supports both standard App Passwords and Google/Microsoft OAuth2 refresh token authentication.
* **OpenClaw Native Tools**: Exposes 4 ready-to-use tools directly to the OpenClaw AI engine.

---

## 🚀 Installation

```bash
# Clone or copy into your OpenClaw plugins directory
cd d:/email-sender
npm install
npm run build
```

---

## ⚙️ Configuration

You can configure the plugin via environment variables (`.env`) or within your OpenClaw configuration file (`~/.openclaw/config.json`).

### Environment Variables (`.env`)

```env
# SMTP Configuration (Sending)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_AUTH_TYPE=basic
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_NAME="OpenClaw AI Assistant"
SMTP_FROM_ADDRESS=your-email@gmail.com
SMTP_RATE_LIMIT=60

# IMAP Configuration (Reading Inbox)
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_SECURE=true
IMAP_AUTH_TYPE=basic
IMAP_USER=your-email@gmail.com
IMAP_PASS=your-app-password
IMAP_DEFAULT_MAILBOX=INBOX

# Security Controls
ALLOWED_DOMAINS=company.com,partner.org
```

### OpenClaw Config File (`openclaw.config.json`)

```json
{
  "plugins": {
    "openclaw-plugin-email-sender": {
      "enabled": true,
      "smtp": {
        "host": "smtp.gmail.com",
        "port": 587,
        "secure": false,
        "auth": {
          "type": "basic",
          "user": "agent@company.com",
          "pass": "env:SMTP_APP_PASSWORD"
        },
        "fromName": "OpenClaw Assistant",
        "fromAddress": "agent@company.com"
      },
      "imap": {
        "host": "imap.gmail.com",
        "port": 993,
        "auth": {
          "type": "basic",
          "user": "agent@company.com",
          "pass": "env:SMTP_APP_PASSWORD"
        }
      },
      "security": {
        "allowedRecipientDomains": ["company.com", "partner.org"],
        "maxEmailsPerHour": 100,
        "maxEmailSizeMb": 25
      },
      "templates": {
        "inlineTemplates": {
          "welcome_email": "<h1>Welcome {{name}}</h1><p>Your ticket reference is #{{ticketId}}.</p>"
        }
      }
    }
  }
}
```

---

## 🛠️ OpenClaw Tool Specifications

### 1. `send_email`
Dispatches an email via SMTP.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `to` | `string[]` | **Yes** | Recipient email address(es) |
| `subject` | `string` | **Yes** | Email subject line |
| `text` | `string` | No | Plain text content |
| `html` | `string` | No | HTML content |
| `templateName` | `string` | No | Name of registered Handlebars template |
| `templateData` | `object` | No | Variables passed to template |
| `cc` | `string[]` | No | Carbon copy recipients |
| `bcc` | `string[]` | No | Blind carbon copy recipients |
| `attachments` | `array` | No | List of files with `filename`, `content` (base64) or `path` |

### 2. `read_emails`
Fetches and searches inbox messages via IMAP.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `mailbox` | `string` | No | Target folder (default `"INBOX"`) |
| `unreadOnly` | `boolean` | No | Filter for unseen emails only |
| `limit` | `number` | No | Max emails to return (default 10) |
| `sinceDate` | `string` | No | ISO date filter (e.g. `"2026-10-01"`) |
| `subjectSearch` | `string` | No | Filter by subject keyword |
| `fromAddress` | `string` | No | Filter by sender address |
| `markAsRead` | `boolean` | No | Mark returned emails as read |

### 3. `verify_email_connection`
Tests connectivity and authentication for configured SMTP/IMAP servers.

### 4. `render_email_template`
Previews or renders Handlebars templates with data.

---

## 🧪 Testing & Demonstration

Run live end-to-end demo using auto-generated Ethereal SMTP test account:

```bash
npm run demo
```

Run unit tests:

```bash
npm test
```

Build TypeScript code:

```bash
npm run build
```

---

## 👤 Author

**KANAGARAJ-M**

---

## 📄 License

MIT License © 2026 KANAGARAJ-M. Designed for OpenClaw ecosystem.

