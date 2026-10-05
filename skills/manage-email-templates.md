---
name: manage-email-templates
description: Skill for creating, rendering, previewing, and saving custom Handlebars email templates in OpenClaw.
---

# Skill: Manage Email Templates

Use this skill when the user asks to create a new custom email layout, preview a template, or save template files.

## 🛠️ Execution Procedure

### Creating a New Template
Call `create_email_template`:

```json
{
  "templateName": "event_invitation",
  "templateContent": "<div style='padding: 20px; border: 1px solid #6366f1;'><h2>You are invited: {{eventName}}</h2><p>Date: {{eventDate}}</p><a href='{{rsvpUrl}}'>RSVP Here</a></div>",
  "saveToDiskDir": "./templates"
}
```

### Previewing / Rendering Template
Call `render_email_template`:

```json
{
  "templateName": "event_invitation",
  "data": {
    "eventName": "OpenClaw AI Summit 2026",
    "eventDate": "15 November 2026",
    "rsvpUrl": "https://nocorps.in/rsvp"
  }
}
```
