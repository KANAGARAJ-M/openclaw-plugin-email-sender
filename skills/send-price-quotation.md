---
name: send-price-quotation
description: Skill for calculating line item totals, GST/tax, and sending itemized price quotations via email.
---

# Skill: Send Price Quotation

Use this skill when the user asks to send a price estimate, quotation, or pro-forma invoice to a customer.

## 🛠️ Execution Procedure

### Step 1: Calculate Item Totals & Subtotals
For each line item:
$$\text{itemTotal} = \text{qty} \times \text{unitPrice}$$

$$\text{subtotal} = \sum \text{itemTotal}$$
$$\text{tax} = \text{subtotal} \times 0.18 \quad \text{(if 18\% GST applicable)}$$
$$\text{grandTotal} = \text{subtotal} + \text{tax}$$

### Step 2: Invoke `send_email` with `"quotation"` Template

```json
{
  "to": ["customer@example.com"],
  "subject": "Quotation #QT-2026-104 for Software Services",
  "templateName": "quotation",
  "templateData": {
    "quoteNumber": "QT-2026-104",
    "quoteDate": "05 Oct 2026",
    "validUntil": "04 Nov 2026",
    "customerName": "Acme Solutions",
    "providerName": "Nocorps Business",
    "currencySymbol": "₹",
    "items": [
      {
        "description": "OpenClaw Email Sender Plugin License",
        "qty": 1,
        "unitPrice": 15000,
        "total": 15000
      },
      {
        "description": "Custom Template Design & Setup",
        "qty": 3,
        "unitPrice": 2000,
        "total": 6000
      }
    ],
    "subtotal": "21000",
    "tax": "3780",
    "grandTotal": "24780",
    "paymentTerms": "50% advance upon PO, balance upon completion.",
    "acceptUrl": "https://nocorps.in/quote/accept?id=QT-2026-104"
  }
}
```

### Step 3: Confirm Delivery
Provide the user with the quotation summary (Quote #, Grand Total, Recipient).
