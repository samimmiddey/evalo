# AGENTS.md

## Project Overview

Evalo is a two-sided mock technical interview platform. Candidates book sessions with vetted interviewers using credits and receive structured AI evaluation reports (Google Gemini). Interviewers set weekly availability, conduct live sessions (Stream Video & Chat), and earn credits redeemable for payouts.

---

## Commands & Setup

- **Package Manager**: Use `npm` (`package-lock.json` is the sole repository lockfile). Do not use `pnpm` or `yarn`.
- **Install dependencies**: `npm install` (local) or `npm ci` (CI/clean build)
- **Dev server**: `npm run dev`
- **Lint**: `npm run lint` (runs `eslint .` — warnings allowed, errors fail)
- **Typecheck**: `npx tsc --noEmit`
- **Build**: `npm run build` (Next.js standalone build)
- **Start production server**: `npm run start`
- **Prisma commands**:
  - `npx prisma generate`: Re-generate client into `src/generated/prisma/` (run after schema edits)
  - `npx prisma db push`: Push schema changes directly to DB (dev only)
  - `npx prisma migrate dev --name <migration-name>`: Create and apply DB migration locally
  - `npx prisma migrate deploy`: Apply existing migrations in CI/production using `DIRECT_URL`
- **Git hook checks**:
  - `npx lint-staged`: Staged files lint fix (runs on `pre-commit`)
  - `npx --no -- commitlint --edit "$1"`: Conventional commits validation (runs on `commit-msg`)

---

## Repository Structure

- `src/app/`: Next.js App Router
  - `(auth)/`: `/sign-in`, `/sign-up`, `/forgot-password`
  - `(routes)/(public)/`: `/`, `/about`, `/pricing`, `/contact`, `/sso-callback`
  - `(routes)/(protected)/`: Protected routes wrapped in `OnboardingProtection` and `UserGate`
    - `/dashboard`: Shared dynamic dashboard overview
    - `/dashboard/appointments`, `/dashboard/interviewers`: Candidate routes
    - `/dashboard/sessions`, `/dashboard/availability`, `/dashboard/payouts`, `/dashboard/profile`: Interviewer routes
  - `/call/[id]`: Live video/chat room (shared by candidate and interviewer)
  - `/onboarding`: Onboarding wizard for candidates and interviewers
  - `api/`: API route handlers (`appointments/`, `availability/`, `call/`, `dashboard/`, `interviewers/`, `onboarding/`, `payouts/`, `platform-config/`, `profile/`, `sessions/`, `user/`)
  - `api/webhooks/`: Webhooks (`billing/`, `clerk/`, `stream/`, `stream-business/`)
- `src/features/`: Domain logic divided by feature (`auth/`, `interviews/`, `onboarding/`, `special/`, `static/`)
  - Features contain subfolders: `components/`, `schemas/`, `services/`, `types/`
- `src/components/`: Reusable presentation primitives only (`common/`, `layouts/`, `navigation/`, `providers/`, `ui/`, `wrappers/`)
- `src/constants/`: App constants including `query-urls.tsx`, `metadata.ts`, `clerk-appearance.ts`
- `src/generated/prisma/`: Generated Prisma client. **Do not edit manually.**
- `src/hooks/`: Custom hooks (`use-app-user`, `use-fetch`, `use-mutation`, `use-infinite-fetch`, etc.)
- `src/lib/`: Utilities (`prisma.ts`, `api.ts`, `api-response.ts`, `api-error.ts`, `server-error.ts`, `app-error.ts`, `utils.ts`)
- `src/proxy.ts`: Next.js 16 proxy middleware (Clerk auth gate, onboarding check, and RBAC redirect)
- `src/security/`: Arcjet client and `bookingLimiter` rate-limiting helper
- `src/services/`: App-wide client (`global`, `user`) and server (`stream`, `user`, `global`) services
- `src/store/`: Zustand stores (`auth-store.ts`, `ui-store.ts`, `user-store.ts`)
- `src/types/`: Shared TypeScript types (`api.types.ts`, `user.types.ts`, `stream.types.ts`, `globals.d.ts`)

---

## Conventions & Rules

- **Client vs Server Services**:
  - Client services (`*.client.service.ts`): Mark `"use client"`, call API via `api` (`ky`) from `@/lib/api`, catch with `apiError({ error, fallbackMessage })` (takes object parameter).
  - Server services (`*.server.service.ts`): Use `db` from `@/lib/prisma`, catch with `serverError({ error, fallbackMessage })` (takes object parameter).
  - Never query `db` directly inside components or API route handlers — always delegate to server services.
- **API Route Handlers**:
  - Keep route files thin: validate/parse parameters -> call server service -> return `apiResponse({ statusCode, data })`.
  - Handle errors in catch blocks with `return apiErrorResponse({ error })` from `@/lib/api-response`.
  - Use typed `AppError` subclasses from `@/lib/app-error` (`UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ValidationError`, `ConflictError`).
- **ESLint `no-console` is an ERROR**:
  - `console.log` causes an ESLint build failure.
  - For server error logging in webhooks or catch blocks, use `// eslint-disable-next-line no-console`.
- **Imports & Aliases**:
  - Always use `@/` alias (maps to `src/*`). Never use relative paths navigating upwards across features.
- **Forms & Validation**:
  - Use React Hook Form with Zod schemas via `@hookform/resolvers/zod`. Export inferred schema types (`z.infer<typeof schema>`).
- **Styling**:
  - Tailwind CSS v4 utility classes. Default theme is dark (`bg-zinc-950`). Do not use inline `style` props for layout.

---

## Verification & Definition of Done

Before considering work complete:
1. `npm run lint` must pass with 0 errors (`no-console` and unused variables are errors).
2. `npx tsc --noEmit` must pass with 0 TypeScript diagnostics.
3. `npm run build` must succeed without build errors.
4. If `prisma/schema.prisma` was modified, `npx prisma generate` must have run and generated cleanly.
5. Commits must pass commitlint: format `<type>(<scope>): <subject>` or `<type>: <subject>` (e.g. `feat: add interviewer sorting`). Allowed types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`. Max line length 100 characters, lowercase type, no trailing period.

---

## Boundaries

- **Always do**:
  - Keep domain logic inside `src/features/`.
  - Re-generate Prisma client (`npx prisma generate`) after modifying schema.
  - Wrap API responses in `apiResponse` or `apiErrorResponse`.
  - Use typed error classes (`NotFoundError`, `ValidationError`, etc.) from `@/lib/app-error`.
- **Ask before doing**:
  - Modifying `prisma/schema.prisma` requiring database migrations.
  - Re-enabling commented Arcjet middleware shielding / bot detection in `src/proxy.ts`.
  - Changing Clerk JWT custom session claims or onboarding redirection flow.
  - Adding third-party packages or changing lockfile tooling.
- **Never touch**:
  - `src/generated/prisma/*` manually (auto-generated by Prisma).
  - `src/components/ui/*` manually (auto-generated shadcn components; edit via CLI or wrap in `src/components/common/`).
  - Production database credentials or secrets directly.

---

## Workflow & Deployment

- **Branches**:
  - `staging`: Development and deployment branch (no production branch exists yet; production branch will be added later).
  - Working branches: `feature/*`, `fix/*`.
- **CI / CD Pipeline**:
  - PRs to `staging` (or `main`) run `.github/workflows/ci.yml`: `npm ci`, `npx prisma generate`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
  - Pushes to `staging` run `.github/workflows/deploy.yml`: applies migrations via `npx prisma migrate deploy` using `DIRECT_URL`, builds Docker image with build arguments, pushes to GHCR, and triggers the Render deploy hook.

---

## Pitfalls & Quirks

- **Database Connection Strings**:
  - `DATABASE_URL`: Supabase pooled connection string (`pgbouncer=true`, port 6543) used at runtime with `@prisma/adapter-pg`.
  - `DIRECT_URL`: Direct connection string (port 5432) required by `prisma.config.ts` for schema migrations.
- **Next.js 16 Middleware (`src/proxy.ts`)**:
  - Next.js 16 uses `src/proxy.ts` (not `middleware.ts`).
  - Unauthorized role access to role-gated routes redirects to `/dashboard`.
  - `/api(.*)` is public in `proxy.ts`, so API routes must enforce authentication internally (`currentUser()`, `auth()`, or webhook signatures).
  - Stale Clerk JWT: Clerk stores `role` and `onboardingComplete` in `sessionClaims.metadata`. After onboarding completion, reload session (`session.reload()`) to prevent redirect loops.
- **Arcjet Status**:
  - Arcjet bot detection is commented out in `src/proxy.ts`.
  - `bookingLimiter` is active in `src/features/interviews/interviewer-details/services/details.server.service.ts` (rate limits bookings per user).
- **Webhook Handlers**:
  - Svix verifies Clerk user (`CLERK_WEBHOOK_USER_SECRET`) and billing (`CLERK_WEBHOOK_BILLING_SECRET`) webhooks.
  - Stream verifies `x-signature` (`STREAM_SECRET_KEY`) for `stream` and `stream-business` webhooks.

---

## Pointers to Other Documentation

- [DESIGN.md](DESIGN.md): System architecture and design decisions reference. Read DESIGN.md before architectural changes.
- [README.md](README.md): Basic Next.js setup instructions
- [prisma/schema.prisma](prisma/schema.prisma): Complete data model, relations, and enums
- [.github/workflows/ci.yml](.github/workflows/ci.yml): Pull request validation pipeline
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml): Staging deployment pipeline and build args
