---
name: process-inbox-enquiries
description: Skill for checking unread inbox messages, reading customer inquiries, and sending automated or approval-guided responses.
---

# Skill: Process Inbox Enquiries

Use this skill when the user asks to check incoming customer emails, read unread inquiries, or auto-reply to questions.

## 🛠️ Execution Procedure

### Step 1: Read Unread Emails via IMAP
Call `read_emails` tool:

```json
{
  "mailbox": "INBOX",
  "unreadOnly": true,
  "limit": 5,
  "markAsRead": false
}
```

### Step 2: Extract & Analyze Question
For each returned message:
- Extract `from.address`, `subject`, and `date`.
- Identify key inquiry details.

### Step 3: Respond Using `"enquiry"` Template
Call `send_email`:

```json
{
  "to": ["sender@example.com"],
  "subject": "Re: Inquiry regarding OpenClaw plugin",
  "templateName": "enquiry",
  "templateData": {
    "enquiryId": "ENQ-9012",
    "customerName": "Customer Name",
    "enquirySubject": "Inquiry regarding OpenClaw plugin",
    "responseMessage": "Thank you for reaching out! Our plugin supports both SMTP sending and IMAP reading out of the box.",
    "agentName": "Nocorps Support Team"
  }
}
```

### Step 4: Mark Processed Email as Read
Re-run `read_emails` with `markAsRead: true` or update flags.
