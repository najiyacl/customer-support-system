# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A customer support ticketing system. Customers email a support address; emails are ingested via webhook, converted into tickets, categorised by AI, and auto-responded using a knowledge base (PDF). A single admin logs in to manage tickets that the AI could not resolve. Full plan is in [PROJECT_PLAN.md](PROJECT_PLAN.md).

Two sub-projects live side by side:

```
backend/   Spring Boot 3.5.3 · Java 21 · Maven (mvnw)
frontend/  React 19 · Vite 8 · Tailwind v4
```

---

## Running the apps

**Java is not on PATH.** Always set `JAVA_HOME` explicitly:

```bash
export JAVA_HOME=/Users/najiya/Library/Java/JavaVirtualMachines/openjdk-26.0.1/Contents/Home
```

**Node / npm are not on PATH.** Use the local install:

```bash
~/.local/bin/node
~/.local/bin/npm
```

### Backend (port 8080)

```bash
cd backend
JAVA_HOME=... ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

The `dev` profile uses H2 in-memory DB — no PostgreSQL required. To use PostgreSQL, omit the profile flag and set `DB_USERNAME`, `DB_PASSWORD`, and `ANTHROPIC_API_KEY` environment variables.

### Frontend (port 5173)

```bash
cd frontend
~/.local/bin/npm run dev
```

Vite proxies every `/api/*` request to `http://localhost:8080`, so the frontend never needs the backend port hardcoded.

### Build / test / lint

```bash
# Backend — compile and test
cd backend && JAVA_HOME=... ./mvnw verify

# Backend — run a single test class
cd backend && JAVA_HOME=... ./mvnw test -Dtest=MyTestClass

# Frontend — lint
cd frontend && ~/.local/bin/npm run lint

# Frontend — production build
cd frontend && ~/.local/bin/npm run build
```

---

## Architecture

### Backend package layout (`com.customersupport`)

| Package | Purpose |
|---|---|
| `web` | REST controllers — all mapped under `/api` |
| `config` | Spring configuration beans (security, etc.) |
| *(planned)* `domain` | JPA entities |
| *(planned)* `service` | Business logic, Spring AI calls |
| *(planned)* `repository` | Spring Data JPA interfaces |

**Security** (`config/SecurityConfig.java`): CSRF disabled (stateless API). `/api/health` and `/h2-console/**` are public; everything else requires authentication. JWT auth via `io.jsonwebtoken` (jjwt 0.12.x) — not yet wired, planned in `app.jwt.*` properties.

**Spring AI**: `spring-ai-starter-model-anthropic` is on the classpath. The `ChatClient` bean is autoconfigured from `spring.ai.anthropic.*`. Model is `claude-sonnet-4-6`, max-tokens 2048.

**pgvector (disabled in dev)**: `spring-ai-starter-vector-store-pgvector` and `spring-ai-advisors-vector-store` are commented out in `pom.xml`. Uncomment both and remove the `spring.autoconfigure.exclude` in `application-dev.yml` once PostgreSQL with the pgvector extension is available.

**PDF knowledge base**: `spring-ai-pdf-document-reader` is on the classpath for document ingestion.

### Frontend

Tailwind v4 is configured as a Vite plugin (no `tailwind.config.js` needed — just `@import "tailwindcss"` in `index.css`). React Query (`@tanstack/react-query`), Axios, React Router v7, and Recharts are installed but not yet wired up beyond the health check in `App.jsx`.

---

## Environment variables

| Variable | Where used | Default |
|---|---|---|
| `ANTHROPIC_API_KEY` | `application.yml` / `application-dev.yml` | empty (dev placeholder) |
| `DB_USERNAME` | `application.yml` | `postgres` |
| `DB_PASSWORD` | `application.yml` | `postgres` |
| `JWT_SECRET` | `application.yml` | insecure placeholder |

Set these in the shell before running, or export them in a local `.env` file sourced before `./mvnw`.

---

## Key constraints

- **Maven version**: managed by the wrapper (`mvnw`), downloads Maven 3.9.15 on first run.
- **Spring Boot version**: `3.5.3` — the Spring Initializr suggested `3.5.14.RELEASE` but that version is not yet in Maven Central; do not upgrade until it appears there.
- **Spring AI version**: `1.0.0` — same constraint; `1.1.x` is not yet in Maven Central.
- **No Docker**: PostgreSQL must be installed locally for the production profile. Dev profile uses H2 to avoid this dependency.
