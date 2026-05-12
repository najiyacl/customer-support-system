# Customer Support Management System — MVP Plan

## Problem
Customer emails are unorganised and hard to manage. There is no visibility into volume, response times, or trends. Responses are manual and inconsistent.

## Solution Overview
Customers email a support address. Emails are automatically ingested via webhook, converted to tickets, categorised by AI, and responded to by an AI agent using a knowledge base. A single admin agent logs into the system to handle tickets the AI could not resolve.

---

## Architecture

- **Email ingestion:** Inbound webhook (e.g. SendGrid, Mailgun, or Postmark inbound parse)
- **AI layer:** Categorisation + auto-response using a knowledge base
- **Escalation:** Tickets the AI cannot confidently answer are flagged for human review
- **Thread handling:** Customer replies to the same email thread update the existing ticket, not create a new one
- **Access:** Single admin agent only — customers interact via email only

---

## MVP Features

### Email & Ticket Ingestion
- Receive inbound emails via webhook from email provider
- Parse sender, subject, body, and thread ID from the webhook payload
- Create a new ticket for new emails; append replies to the existing ticket thread

### Ticket Management
- Each ticket has:
  - Sender email, subject, full message thread
  - Category (auto-assigned by AI)
  - Status (see below)
  - Timestamps (created, last updated, resolved)
- Ticket statuses:
  - **Open** — new ticket, not yet actioned
  - **AI Responded** — AI sent an auto-reply, awaiting customer follow-up
  - **Needs Attention** — AI could not respond with confidence, waiting for human
  - **In Progress** — admin is actively working on the ticket
  - **Resolved** — issue addressed, ticket closed

### AI Categorisation
- On ticket creation, AI classifies the email into a category (e.g. billing, technical, general enquiry, complaint)
- Category is stored on the ticket and shown in the UI

### AI Auto-Response
- AI attempts to answer using a predefined knowledge base
- If confidence is above a threshold, AI sends the reply automatically and sets status to **AI Responded**
- If confidence is below threshold, ticket is flagged as **Needs Attention** for human review

### Knowledge Base
- Single PDF document uploaded by the admin
- AI uses the PDF content to answer customer questions
- Admin can replace the PDF via the UI

### Human Agent (Admin) Interface
- Secure login (email + password)
- Ticket list view with filters by status and category
- Ticket detail view showing full email thread
- Admin can type and send a reply directly from the UI (sent via email)
- Admin can manually change ticket status
- Admin can reassign a category if AI got it wrong

### Dashboard & Metrics
- Total tickets today / this week / this month
- Tickets by status (chart)
- Tickets by category (chart)
- Average first response time
- AI vs. human response breakdown

### Auth & Security
- Admin login protected with hashed password and session/JWT auth
- Webhook endpoint validated using provider signature verification
- No customer-facing login or portal

---

## Out of Scope (MVP)

- Multiple agents or team management — single admin only
- Customer portal or self-service — email only
- SLA tracking or breach alerts
- Canned responses / saved reply templates
- Bulk ticket actions (bulk close, bulk assign)
- Mobile app or mobile-optimised UI
- CRM integrations (Salesforce, HubSpot, etc.)
- Attachments handling in emails
- Rich text / HTML email composition from UI
- Custom ticket fields or custom workflows
- Email scheduling (send later)
- Two-factor authentication
- Audit log of admin actions
- Data export (CSV, PDF reports)
- Spam filtering
