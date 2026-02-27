# sevgin-me Project Plan: Next.js Monolith (Portfolio + Admin)

## Overview

Based on "Option A", we are building a unified Next.js Fullstack Monolith. It will serve the public personal portfolio (`/`), a secure admin dashboard (`/admin`), and expose standard API routes (`/api/...`) that a future mobile app can consume.

## Project Type

**WEB** (with backend API routes)

## Success Criteria

1. Public visitors can view the portfolio and personal information.
2. The owner can securely log in to an admin dashboard.
3. The owner can manage (CRUD) portfolio items and page content via the admin dashboard.
4. API routes are cleanly structured and return JSON, making them ready for future mobile integration.

## Tech Stack

- **Frontend & Backend:** Next.js (App Router, React 19)
- **Database:** PostgreSQL (already provisioned via Docker)
- **ORM:** Prisma (already installed)
- **Styling:** Tailwind CSS (industry standard, to be verified/configured)
- **Authentication:** NextAuth.js or custom JWT (pending user confirmation)

## File Structure (Planned)

```text
src/
├── app/
│   ├── (public)/         # Public facing pages
│   │   ├── page.tsx
│   │   ├── about/page.tsx
│   │   └── portfolio/page.tsx
│   ├── admin/            # Protected admin portal
│   │   ├── layout.tsx    # Admin layout / Sidebar
│   │   ├── page.tsx      # Dashboard
│   │   └── portfolio/    # Portfolio management
│   ├── api/              # JSON API (Web & future Mobile)
│   │   ├── auth/
│   │   └── portfolio/
│   ├── globals.css
│   └── layout.tsx
├── components/           # UI Components (Admin vs Public)
├── lib/                  # Utilities, Prisma DB client
└── types/                # Shared TypeScript definitions
```

## Task Breakdown

### 1. Foundation & Database Schema

- **Agent:** `database-architect`
- **Skills:** `database-design`
- **INPUT:** Project requirements for Portfolio and Content models.
- **OUTPUT:** Updated `schema.prisma`, generated migrations.
- **VERIFY:** `npx prisma migrate status` confirms successful connection and migration.

### 2. Authentication Setup

- **Agent:** `security-auditor`, `backend-specialist`
- **Skills:** `api-patterns`
- **INPUT:** Chosen auth method (NextAuth vs Custom).
- **OUTPUT:** Configured authentication system, protected `/admin` routes.
- **VERIFY:** Attempting to access `/admin` redirects to login; valid credentials grant access.

### 3. API Route Engineering (Mobile-Ready)

- **Agent:** `backend-specialist`
- **Skills:** `api-patterns`
- **INPUT:** Database schema.
- **OUTPUT:** Clean RESTful GET/POST/PUT/DELETE endpoints in `src/app/api/`.
- **VERIFY:** Postman or curl tests return correct HTTP status codes and JSON structures.

### 4. Admin Panel UI Implementation

- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`, `clean-code`
- **INPUT:** API routes.
- **OUTPUT:** React Server/Client Components for the admin dashboard (forms, tables).
- **VERIFY:** Can successfully create/edit/delete a portfolio item using the UI.

### 5. Public Portfolio UI Implementation

- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`, `seo-fundamentals`
- **INPUT:** Design preferences, database content.
- **OUTPUT:** Fully responsive public-facing pages.
- **VERIFY:** Public pages render correctly, fetching live data from the database.

## Phase X: Verification (MANDATORY)

After implementation, the following must pass:

- [ ] Linting & Type checking: `npm run lint && npx tsc --noEmit`
- [ ] Build test: `npm run build`
- [ ] Required Python audits: (e.g., `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .`)
- [ ] Manual test: End-to-end flow of logging in, creating context, and viewing it publicly.
