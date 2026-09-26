# AGENTS.md

## Project Overview

Evalo is a two-sided platform that lets candidates book mock technical interviews with vetted interviewer professionals. Candidates browse and filter interviewers, book time slots using a credit system, and receive structured AI-assisted feedback. Interviewers set availability, conduct sessions, and earn credits that can be paid out.

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
- **Video/Chat**: Stream (`@stream-io/video-react-sdk` + `@stream-io/node-sdk` for server, `stream-chat` + `stream-chat-react` for in-call chat)
- **AI / LLM**: Google Gemini (`@google/generative-ai` with `gemini-3.6-flash` model for live technical question generation and automated transcript evaluation)
- **Security**: Arcjet (`@arcjet/next`) — installed but currently **commented out** in `src/proxy.ts`
- **Webhooks**: Svix (Clerk webhook verification) + Stream Webhooks (recording/transcription ingestion)
- **Utilities**: `date-fns` (date formatting), `uuid` (ID generation), `react-canvas-confetti` (celebration animations)
- **Fonts**: Outfit (primary), Inter, MuseoModerno, Lobster Two — all via `next/font/google`
- **Linting**: ESLint 9 + `typescript-eslint`
- **Git hooks**: Husky 9 + lint-staged + commitlint (conventional commits enforced)

---

## Directory Structure

```
src/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Auth pages (sign-in, sign-up, forgot-password, sso-callback)
│   ├── (routes)/                     # Application pages
│   │   ├── (protected)/              # Protected role-gated routes
│   │   │   ├── layout.tsx            # Wraps children in OnboardingProtection > UserGate
│   │   │   ├── user-gate.tsx         # Server component: fetches DB user, enforces role gates
│   │   │   ├── onboarding-protection.tsx # Enforces onboarding completion
│   │   │   └── dashboard/            # Role dashboard parent
│   │   │       ├── page.tsx          # Dynamic overview (CandidateOverview vs InterviewerOverview)
│   │   │       ├── layout.tsx        # Dashboard layout with sidebar and navbar
│   │   │       ├── appointments/     # Candidate: view scheduled, completed, and cancelled bookings
│   │   │       ├── interviewers/     # Candidate: explore interviewers list + profile/booking ([id]/)
│   │   │       ├── sessions/         # Interviewer: view conducted sessions & candidate feedback
│   │   │       ├── availability/     # Interviewer: configure weekly recurring availability slots
│   │   │       ├── payouts/          # Interviewer: view earnings, balance & submit payout requests
│   │   │       └── profile/          # Interviewer: manage bio, designation, experience & domains
│   │   └── (public)/                 # Public marketing pages (home, about, pricing, contact)
│   ├── call/                         # Live video interview room
│   │   └── [id]/                     # Live room ([id]/page.tsx) — accessible to both Candidate and Interviewer
│   ├── onboarding/                   # Onboarding wizard page (Candidate vs Interviewer onboarding)
│   ├── api/                          # Route handlers (Next.js API routes)
│   │   ├── appointments/             # GET list, GET stats, POST cancel-booking, POST retry-booking
│   │   ├── availability/             # GET availability, POST create slots, DELETE slots
│   │   ├── call/                     # GET details, POST complete, POST generate-questions
│   │   ├── dashboard/                # GET stats
│   │   ├── interviewers/             # GET list, GET details, GET feedback, POST book-session
│   │   ├── onboarding/               # POST complete onboarding mutation
│   │   ├── payouts/                  # GET stats, GET list, POST request payout
│   │   ├── profile/                  # POST update profile
│   │   ├── sessions/                 # GET sessions list
│   │   ├── user/                     # GET current DB user data
│   │   └── webhooks/
│   │       ├── billing/              # Billing & subscription payment webhook
│   │       └── clerk/                # Clerk user lifecycle webhook
│   │       └── stream/               # Stream recording & transcription ready webhook (Gemini AI evaluation)
│   └── css/                          # Global CSS files (globals.css, responsive.css, external.css)
│
├── features/                         # Domain logic — primary location for business code
│   ├── auth/                         # Sign-in, sign-up, OTP, SSO callback, forgot-password components
│   ├── interviews/                   # All interview-related domain features
│   │   ├── appointments/             # Candidate appointments view: components, services, types
│   │   ├── availability/             # Interviewer slot builder: components, services, types
│   │   ├── call/                     # Live call room: call-room, setup lobby, chat panel, AI questions
│   │   ├── dashboard/                # Dashboard overviews: CandidateOverview, InterviewerOverview, KPI stats
│   │   ├── interviewer-details/      # Interviewer public profile & slot booking: components, services, types
│   │   ├── interviewer-list/         # Browse & filter interviewers: components, services, types
│   │   ├── payouts/                  # Interviewer earnings & payout modal: components, services, types
│   │   ├── profile/                  # Interviewer profile settings form: components, services, types
│   │   ├── sessions/                 # Interviewer session history & feedback viewer: components, services, types
│   │   └── shared/                   # Shared types, feedback modal, card layouts used across interview sub-features
│   ├── onboarding/                   # Onboarding form, candidate-tab, interviewer-tab, schemas, services
│   ├── special/                      # Error screens, not-found screens, screen loaders
│   └── static/                       # Static marketing pages (Hero, Role cards, Pricing, Testimonials, FAQ)
│
├── components/                       # Shared, reusable UI only — no domain logic here
│   ├── common/                       # App-wide primitives (Logo, Spinner, ScreenLoader, SearchBar, etc.)
│   ├── layouts/                      # Layout wrappers (HeaderLayout, CardLayout, PageHeaderLayout)
│   ├── navigation/                   # Navbar, sidebar navigation, dashboard header
│   ├── providers/                    # Context providers (ThemeProvider)
│   ├── ui/                           # shadcn/ui generated components — DO NOT hand-edit these
│   └── wrappers/                     # Decorator components (GradientWrapper, etc.)
│
├── config/                           # App-wide constants
│   └── query-urls.tsx                # All API path segments as named string constants
│
├── data/                             # Static/seed data objects (e.g. navigation, onboarding defaults, mock data)
├── generated/                        # Prisma generated client — DO NOT edit manually
├── hooks/                            # Custom React hooks
│   ├── use-app-user.ts               # Fetch current DB user with Clerk sync
│   ├── use-dashboard-menu.ts         # RBAC-driven sidebar navigation items
│   ├── use-debounce.ts               # Debounced input value hook
│   ├── use-fetch.ts                  # Single-resource / paginated data fetching
│   ├── use-infinite-fetch.ts         # Infinite scroll data fetching
│   ├── use-media-query.ts            # Responsive breakpoint detection
│   ├── use-mutation.ts               # Write operations (POST/PUT/DELETE)
│   ├── use-pagination-trigger.ts     # Intersection observer for pagination
│   ├── use-role-based-redirect.ts     # RBAC-aware navigation redirect
│   ├── use-scroll-to-top.ts          # Scroll restoration on route change
│   └── use-view.ts                   # Toggle between view modes (list/grid)
├── lib/                              # Shared server/client utilities
│   ├── api.ts                        # Configured ky instance (prefix="api", 10s timeout, 0 retries)
│   ├── api-error.ts                  # Client-side error normaliser (ky HTTPError → thrown Error)
│   ├── api-response.ts               # Server: standard NextResponse.json shape { success, statusCode, data|error }
│   ├── app-error.ts                  # Typed error classes: AppError, UnauthorizedError, ForbiddenError,
│   │                                 #   NotFoundError, ValidationError, ConflictError, RateLimitError
│   ├── prisma.ts                     # Singleton Prisma client with pg connection pool
│   ├── server-error.ts               # Server-side error normaliser (Prisma errors → user-safe messages)
│   └── utils.ts                      # cn() and other generic utils
├── proxy.ts                          # Next.js middleware (Clerk auth, RBAC, onboarding redirect)
├── security/                         # Security utilities
│   └── arcjet.ts                     # Arcjet rate-limiting / bot-detection client
├── services/                         # Top-level cross-feature services
├── store/                            # Zustand stores (UI modal state, active filters)
├── types/                            # Shared TypeScript types
└── utils/                            # Pure utility functions (e.g. redirect URL sanitiser, date formatters)
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
- All source files use **kebab-case**: `interviewer-details.tsx`, `candidate-tab.tsx`, `candidate-overview.tsx`.
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
- Custom CSS utility classes (e.g. `s-margin`, `s-margin-t`, `s-padding-t`, `container`) are defined in `src/app/css/globals.css` and `responsive.css`.
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
| `CLERK_WEBHOOK_USER_SECRET` | Clerk user lifecycle webhook: `src/app/api/webhooks/clerk/` |
| `CLERK_WEBHOOK_BILLING_SECRET` | Billing webhook: `src/app/api/webhooks/billing/` |
| `NEXT_PUBLIC_STREAM_API_KEY` | Stream Video/Chat client SDK (browser) |
| `STREAM_SECRET_KEY` | Stream server SDK — token generation in `call.server.service.ts` |
| `GEMINI_API_KEY` | Google Gemini AI — live question generation & transcript evaluation webhook |
| `ARCJET_KEY` | Arcjet rate-limiting client (currently commented out) |
| `ARCJET_ENV` | Arcjet environment (`development` / `production`) |

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
| `CANDIDATE` | `/dashboard/interviewers(.*)`, `/dashboard/appointments(.*)`, `/call(.*)` | `/dashboard/interviewers` |
| `INTERVIEWER` | `/dashboard/sessions(.*)`, `/dashboard/availability(.*)`, `/dashboard/payouts(.*)`, `/dashboard/profile(.*)`, `/call(.*)` | `/dashboard` |

> `/call(.*)` is intentionally shared between both roles — both interviewers and candidates enter the same live call room.

Adding new role-gated routes requires updating the `roleRouteMap` array in `src/proxy.ts`.

### Prisma & Database
- The Prisma client uses `@prisma/adapter-pg` (Vercel-compatible driver adapter). The standard `new PrismaClient()` without the adapter will not connect correctly.
- Singleton pattern is required in dev to prevent hot-reload from exhausting connection pool: `globalForPrisma.prisma || new PrismaClient(...)`.
- Migrations use `DIRECT_URL` (non-pooled); the runtime uses `DATABASE_URL` (pooled). Do not swap these.
- `prisma.config.ts` loads `.env.local` via `dotenv` — required because Next.js env loading does not apply to the Prisma CLI.

### Arcjet
- `@arcjet/next` is installed but **currently commented out** in `src/proxy.ts`. Bot-detection and rate-limiting rules are defined but disabled — re-enable by uncommenting the `aj` client and the `aj.protect(req)` call.
- Do not remove the commented code; it is intentionally preserved for easy re-activation.

### Structured Error Classes (`src/lib/app-error.ts`)
- Server services should throw typed errors instead of generic `Error` when the failure has a well-known HTTP semantics:
  - `UnauthorizedError` → 401
  - `ForbiddenError` → 403
  - `NotFoundError` → 404
  - `ValidationError` → 400
  - `ConflictError` → 409
  - `RateLimitError` → 429
- `serverError()` in `src/lib/server-error.ts` re-throws these as-is so the API route handler can map them to the correct status code.
- Do **not** use plain `throw new Error("...")` for expected domain failures — use the typed subclass.

### Svix & Stream Webhooks
- Clerk webhook events hit `src/app/api/webhooks/clerk/`. Svix signature verification must not be removed.
- Stream webhook events hit `src/app/api/webhooks/stream/` to process `call.recording_ready` and `call.transcription_ready`, generating Gemini AI feedback reports.

### `pnpm` only
- The project uses `pnpm`. Running `npm install` or `yarn` will create a mismatched lockfile. Always use `pnpm`.
