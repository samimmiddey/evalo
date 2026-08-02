# AGENTS.md

## Project Overview

Evalo is a two-sided platform that lets interviewees book mock technical interviews with vetted interviewer professionals. Interviewees browse and filter interviewers, book time slots using a credit system, and receive structured AI-assisted feedback. Interviewers set availability, conduct sessions, and earn credits that can be paid out.

---

## Tech Stack

- **Language**: TypeScript 5 (strict mode)
- **Framework**: Next.js 16 (App Router)
- **Runtime**: Node.js (server components + API routes)
- **UI**: React 19, Tailwind CSS v4, shadcn/ui (Radix UI primitives), Lucide React icons
- **Animation**: Motion (Framer Motion v12)
- **Auth**: Clerk (`@clerk/nextjs` v7) — custom UI screens, SSO callback, session claims for RBAC
- **Database**: PostgreSQL via Prisma v7 with `@prisma/adapter-pg` (connection pooling via `pg`)
- **ORM**: Prisma — client output at `src/generated/prisma/`
- **HTTP client**: `ky` (browser-side API calls)
- **Forms**: React Hook Form + Zod v4 (`@hookform/resolvers`)
- **State**: Zustand v5 (with `persist` middleware for localStorage)
- **Toasts**: Sonner
- **Carousels**: Embla Carousel
- **Security**: Arcjet (`@arcjet/next`)
- **Webhooks**: Svix (Clerk webhook verification)
- **Fonts**: Outfit (primary), Inter, MuseoModerno, Lobster Two — all via `next/font/google`
- **Linting**: ESLint 9 + `typescript-eslint`
- **Git hooks**: Husky 9 + lint-staged + commitlint (conventional commits enforced)

---

## Directory Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Auth pages (sign-in, sign-up, forgot-password) — layout excluded from nav
│   ├── (routes)/             # Application pages
│   │   ├── (protected)/      # All routes that require auth + onboarding
│   │   │   ├── layout.tsx    # Wraps children in OnboardingProtection > UserGate
│   │   │   ├── user-gate.tsx # Server component: fetches DB user, enforces role gates
│   │   │   ├── onboarding-protection.tsx
│   │   │   ├── explore/      # Interviewee: browse & book interviewers
│   │   │   └── dashboard/    # Interviewer: manage availability, bookings, payouts
│   │   └── (public)/         # Public marketing pages (home, about, pricing, contact)
│   ├── api/                  # Route handlers (Next.js API routes)
│   │   ├── interviewee/      # Interviewee-specific API endpoints
│   │   ├── onboarding/       # Onboarding mutation endpoint
│   │   ├── user/             # User data endpoint
│   │   └── webhooks/
│   │       ├── billing/      # Stripe/billing webhook
│   │       └── clerk/        # Clerk user lifecycle webhook
│   ├── onboarding/           # Onboarding page (outside protected layout)
│   └── css/                  # Global CSS files (globals.css, responsive.css, external.css)
│
├── features/                 # Domain logic — primary location for business code
│   ├── auth/                 # Sign-in, sign-up, OTP, SSO callback, forgot-password components
│   ├── interviewee/
│   │   └── explore/          # Explore page: components, client services, server services, types
│   ├── onboarding/           # Onboarding form, tabs, schemas, services
│   ├── special/              # Error / not-found / special UI screens
│   └── static/               # Static marketing page feature modules
│
├── components/               # Shared, reusable UI only — no domain logic here
│   ├── common/               # App-wide primitives (Logo, Spinner, ScreenLoader, etc.)
│   ├── layouts/              # Layout wrappers
│   ├── navigation/           # Navbar, sidebar navigation
│   ├── providers/            # Context providers (ThemeProvider)
│   ├── ui/                   # shadcn/ui generated components — DO NOT hand-edit these
│   └── wrappers/             # Decorator components (GradientWrapper, etc.)
│
├── config/                   # App-wide constants
│   └── query-urls.tsx        # All API path segments as named string constants
│
├── data/                     # Static/seed data objects (e.g. onboarding form defaults)
├── generated/                # Prisma generated client — DO NOT edit manually
├── hooks/                    # Custom React hooks (use-fetch, use-mutation, use-infinite-fetch, etc.)
├── lib/                      # Shared server/client utilities
│   ├── api.ts                # Configured ky instance (prefix="api", 10s timeout, 0 retries)
│   ├── api-error.ts          # Client-side error normaliser (ky HTTPError → thrown Error)
│   ├── api-response.ts       # Server: standard NextResponse.json shape { success, statusCode, data|error }
│   ├── prisma.ts             # Singleton Prisma client with pg connection pool
│   ├── server-error.ts       # Server-side error normaliser (Prisma errors → user-safe messages)
│   └── utils.ts              # cn() and other generic utils
├── proxy.ts                  # Next.js middleware (Clerk auth, RBAC, onboarding redirect)
├── services/                 # Top-level cross-feature services
│   └── server/               # Server-only service files
├── store/                    # Zustand stores
├── types/                    # Shared TypeScript types
└── utils/                    # Pure utility functions (e.g. redirect URL sanitiser)
```

**Rule**: Domain/business logic lives in `src/features/<domain>/`. `src/components/` is for UI primitives only. API route handlers in `src/app/api/` are thin — they parse params and delegate to a server service in `src/features/<domain>/services/server/`.

---

## Commands

```bash
# Install dependencies
pnpm install

# Dev server (Next.js)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint

# Prisma: generate client (run after any schema change)
pnpm prisma generate

# Prisma: push schema to DB (dev, no migration file)
pnpm prisma db push

# Prisma: create a migration
pnpm prisma migrate dev --name <migration-name>

# Commitlint (used automatically by Husky)
pnpm commitlint
```

> There is no explicit `typecheck` script. Run `npx tsc --noEmit` for a full type check.

---

## Conventions

### File & Folder Naming
- All source files use **kebab-case**: `interviewer-details.tsx`, `explore.client.service.ts`.
- Feature components live in `src/features/<domain>/<feature>/components/`.
- Services are split strictly: `services/client/<name>.client.service.ts` (uses `ky` + `apiError`) and `services/server/<name>.server.service.ts` (uses `db` + `serverError`).
- Schemas live in `<feature>/schemas/<name>.schemas.ts`; types in `<feature>/types/<name>.type.ts`.
- API path constants are declared in `src/config/query-urls.tsx` and imported by client services.

### React / Next.js
- Server components are the default. Add `'use client'` explicitly only where needed (event handlers, hooks, browser APIs).
- Page files (`page.tsx`) are thin: they import and render a single feature component. No logic in page files.
- Route groups `(auth)`, `(routes)/(protected)`, `(routes)/(public)` are used for layout scoping, not URL segments.

### API Routes
- Every route handler wraps all logic in try/catch and returns via `apiResponse({ statusCode, data })` or `apiResponse({ statusCode, error })`.
- The response shape is always `{ success: boolean, statusCode: number, data?: T, error?: string }`.
- Handlers are thin: parse request params → call a server service → return `apiResponse`.

### Services
- **Client services**: `"use client"` directive at top, use `api` from `@/lib/api` (ky), catch with `apiError(error, fallbackMessage)`.
- **Server services**: No directive, use `db` from `@/lib/prisma`, catch with `serverError(error, fallbackMessage)`.
- Never call `db` directly from a route handler or component — always go through a server service.

### Error Handling
- Client errors: `apiError()` normalises `ky.HTTPError` and `Error` instances. In dev it surfaces the real message; in production it shows the `fallbackMessage`.
- Server errors: `serverError()` maps known Prisma error codes (P2025, P2002, P2003) to user-friendly strings. Unknown errors surface the real message in dev only.
- API route handlers catch thrown errors and return a 500 `apiResponse` with the error string in dev, `"Internal Server Error"` in prod.
- Mutations in components use the `useMutation` hook; errors are read from `error` state and displayed via `toast.error(error)` in a `useEffect`.

### State Management
- Global UI/session state: **Zustand** stores in `src/store/`. Use `persist` + `createJSONStorage(() => localStorage)` when state must survive page reload.
- Server/async data: custom hooks — `useFetch` for paginated data, `useInfiniteFetch` for infinite scroll, `useMutation` for write operations.
- No Redux, no React Context for domain state.

### Forms
- All forms use **React Hook Form** with **Zod** resolvers.
- Complex multi-section forms use `FormProvider` + `useFormContext` so sub-components can register fields without prop drilling.
- Schema types are exported from the schema file: `export type OnboardingSchemaTypes = z.infer<typeof onboardingSchema>`.

### Styling
- Tailwind CSS v4 utility classes directly in JSX. No inline `style` props for layout.
- Custom CSS utility classes (e.g. `s-margin-t`, `s-padding-t`, `container`) are defined in `src/app/css/globals.css` and `responsive.css`.
- The app is **dark-first** — default theme is `dark`, root background is `bg-zinc-950`.
- shadcn/ui components live in `src/components/ui/` — they are auto-generated, modify via `shadcn` CLI only.

### Import Paths
- Always use the `@/` alias (maps to `src/`). Never use relative paths that traverse above the feature boundary.

### Commit Messages
- Conventional Commits enforced by commitlint + Husky: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, etc.

---

## Constraints & Gotchas

### Required Environment Variables
All must be present in `.env.local`. Missing any will cause runtime failures:

| Variable | Used by |
|---|---|
| `DATABASE_URL` | `src/lib/prisma.ts` — pooled connection string for Prisma client |
| `DIRECT_URL` | `prisma.config.ts` — direct (non-pooled) connection for migrations |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk provider (client) |
| `CLERK_SECRET_KEY` | Clerk middleware and server SDK |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Clerk routing |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Clerk routing |
| `CLERK_WEBHOOK_SECRET` | Webhooks: `src/app/api/webhooks/clerk/` |

> Clerk stores `onboardingComplete` and `role` in `sessionClaims.metadata`. The middleware reads these from the JWT — stale claims will cause redirect loops. After onboarding, call `session.reload()` immediately.

### Generated Files — Do Not Edit
- `src/generated/prisma/` — entirely generated by `prisma generate`. Any manual edits are overwritten on next generate.
- `src/components/ui/` — generated by the shadcn CLI. Edit only via CLI or by overriding in `src/components/common/`.

### Middleware (`src/proxy.ts`)
- The file is named `proxy.ts`, not `middleware.ts`. Next.js picks it up because `next.config.ts` points to it (verify before renaming).
- Middleware redirect chain order matters: auth route redirect → protect non-public → allow onboarding passthrough → enforce onboarding completion → RBAC. Inserting a rule in the wrong order will silently break redirect flows.
- `/api(.*)` is in the public route list — API routes are **not** protected by middleware. Auth must be enforced inside API route handlers if needed.

### RBAC Route Map
| Role | Allowed routes | Fallback |
|---|---|---|
| `INTERVIEWEE` | `/explore(.*)`, `/interviewers(.*)` | `/explore` |
| `INTERVIEWER` | `/dashboard(.*)` | `/dashboard` |

Adding new role-gated routes requires updating the `roleRouteMap` array in `src/proxy.ts`.

### Prisma & Database
- The Prisma client uses `@prisma/adapter-pg` (Vercel-compatible driver adapter). The standard `new PrismaClient()` without the adapter will not connect correctly.
- Singleton pattern is required in dev to prevent hot-reload from exhausting connection pool: `globalForPrisma.prisma || new PrismaClient(...)`.
- Migrations use `DIRECT_URL` (non-pooled); the runtime uses `DATABASE_URL` (pooled). Do not swap these.
- `prisma.config.ts` loads `.env.local` via `dotenv` — required because Next.js env loading does not apply to the Prisma CLI.

### Arcjet
- `@arcjet/next` is installed but the extent of its integration should be verified before adding new API routes — it may apply rate limiting or bot detection globally.

### Svix / Webhooks
- Clerk webhook events hit `src/app/api/webhooks/clerk/`. Svix signature verification must not be removed — removing it opens the endpoint to spoofed events.

### `pnpm` only
- The project uses `pnpm`. Running `npm install` or `yarn` will create a mismatched lockfile. Always use `pnpm`.
