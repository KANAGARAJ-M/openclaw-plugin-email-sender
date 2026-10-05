---
name: send-business-email
description: Skill for sending corporate communications, project updates, and formal announcements using prebuilt HTML business templates.
---

# Skill: Send Business Email

Use this skill whenever the user wants to send a professional email, project update, or formal corporate communication.

## 📥 Required User Inputs
- Recipient email address(es) (`to`)
- Email Subject line (`subject`)
- Recipient Name (`recipientName`)
- Core Message (`messageBody`)

## 🛠️ Execution Procedure

### Step 1: Formulate Template Payload
Construct the `templateData` object using the prebuilt `"business"` template:

```json
{
  "companyName": "Nocorps Technology",
  "title": "Project Update: OpenClaw Integration",
  "recipientName": "Client Name",
  "messageBody": "<p>We have completed Phase 1 of the integration testing successfully.</p>",
  "actionUrl": "https://nocorps.in/dashboard",
  "actionText": "View Progress Report",
  "senderName": "Kanagaraj M",
  "senderTitle": "Project Lead"
}
```

### Step 2: Invoke `send_email` Tool
Execute the tool with the constructed payload:

```json
{
  "to": ["client@example.com"],
  "subject": "Project Update: OpenClaw Integration",
  "templateName": "business",
  "templateData": {
    "companyName": "Nocorps Technology",
    "title": "Project Update: OpenClaw Integration",
    "recipientName": "Client Name",
    "messageBody": "<p>We have completed Phase 1 of the integration testing successfully.</p>",
    "actionUrl": "https://nocorps.in/dashboard",
    "actionText": "View Progress Report",
    "senderName": "Kanagaraj M",
    "senderTitle": "Project Lead"
  }
}
```

### Step 3: Validate Dispatch Result
Ensure `success: true` is returned and inform the user with the generated `Message-ID`.
