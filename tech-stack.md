# Tech Stack

## Backend — Spring Boot 3.x (Java 21)
- **Spring Web** — REST API and inbound webhook endpoint
- **Spring Security + JWT** (jjwt) — admin authentication and route protection
- **Spring Data JPA + Hibernate** — ORM for PostgreSQL
- **Spring AI** — AI model integration for email categorisation, auto-response generation, and PDF knowledge base reading (Anthropic Claude provider)
- **Build tool:** Maven

## Frontend — React 18 + Vite
- **React Router v6** — client-side routing
- **Axios** — HTTP client for API calls
- **Tailwind CSS** — styling
- **Recharts** — dashboard charts (tickets by status, category, response time)
- **React Query (TanStack Query)** — server state and data fetching

## Database
- **PostgreSQL 15+**

## AI Layer
- **Spring AI** with Anthropic Claude (`claude-sonnet-4-6`)
- Handles: email categorisation, auto-reply generation, PDF document reading for knowledge base context

## Email Provider — TBD
- Inbound emails received via webhook POST to the Spring backend (signature verified)
- Outbound replies sent via provider HTTP API
- Options to evaluate: Mailgun, SendGrid, Postmark

## Local Development
- **Docker Compose** — runs PostgreSQL locally
- **application.yml** — environment config (API keys, DB URL, JWT secret)
