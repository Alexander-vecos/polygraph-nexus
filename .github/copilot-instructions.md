## PolyGraph Nexus — Copilot instructions

Purpose: Give AI agents the exact, discoverable facts needed to make small, safe PRs in this repo (frontend-first PWA with Supabase backend).

Quick architecture summary
- Frontend: Progressive Web App — React + TypeScript + Vite located in `web/` (offline-first behaviour in `web/src/offline`).
- Backend: Supabase (Postgres, Auth, Storage, Realtime). Schema and triggers live in `supabase/migrations/`.

Where to start (highest priority)
- `docs/ARCHITECTURE.md` — system design, RLS and service-role guidance, offline strategy, and AI layer.
- `docs/PROJECT_OVERVIEW.md` — domain model and MVP scope.
- `web/README.md` and `web/src/pages/README.md` — local frontend conventions and page patterns.

Key files & examples (what to touch in practice)
- `web/src/services/supabase/client.ts` — single shared Supabase client. Uses VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. (Do not embed service_role in frontend code.)
- `web/src/stores/auth.store.ts` — zustand store showing session bootstrapping (`useAuthStore.init()`), `onAuthStateChange` pattern and token mirroring.
- `web/src/router.tsx` — routes are registered here (not file-based routing). Add new pages under `web/src/pages/` and import them into this file.
- `web/src/offline/index.ts` — PWA/offline wiring (service-worker, caching strategies).
- `web/src/features/*/*.usecases.ts` — domain use-cases live next to feature types (e.g., `features/chat/chat.usecases.ts`).
- `supabase/migrations/*.sql` — DB schema is canonical; include SQL migrations for any schema changes.

## Code Standards

### Required Before Each Commit
- Run `cd web && npm run lint` to check for linting errors
- Run `cd web && npm run test -- --run` to run tests
- Ensure all tests pass before submitting changes

## Repository Structure

- `web/` - Frontend React/TypeScript PWA application
  - `web/src/pages/` - Page components (route handlers)
  - `web/src/features/` - Feature modules with domain logic
  - `web/src/services/` - External service integrations (Supabase)
  - `web/src/stores/` - Global state management (Zustand)
  - `web/src/shared/` - Shared components and utilities
  - `web/src/offline/` - PWA offline functionality
- `supabase/` - Supabase backend configuration
  - `supabase/migrations/` - Database schema migrations (SQL)
  - `supabase/functions/` - Edge Functions (serverless)
- `docs/` - Project documentation
  - `docs/ARCHITECTURE.md` - System architecture
  - `docs/PROJECT_OVERVIEW.md` - Domain model and MVP scope
  - `docs/DATABASE_SCHEMA.md` - Database schema documentation
- `.github/` - GitHub configuration
  - `.github/copilot-instructions.md` - Repository-wide Copilot instructions
  - `.github/instructions/` - Path-specific Copilot instructions

### Developer workflows (quick commands)

**Setup:**
```bash
cd web
npm install
```

**Development:**
```bash
cd web
npm run dev        # Start dev server
npm run lint       # Run ESLint
npm run test       # Run tests with Vitest
```

**Build & Preview:**
```bash
cd web
npm run build      # TypeScript compile + Vite build
npm run preview    # Preview production build locally
```

**Local Supabase (requires Supabase CLI):**
```bash
supabase start     # Start local Supabase instance
supabase db push   # Apply migrations to local DB
supabase migrate   # Manage migrations
```

Conventions & patterns (project-specific)
- State: small logical stores use `zustand` (see `auth.store.ts`). Keep stores focused and testable.
- Data fetching: prefer TanStack Query for cached async server state; small helpers may call the shared `supabase` client directly.
- Routing: explicit route registration in `web/src/router.tsx` — add imports and route entries there.
- Features: each feature folder contains `*.usecases.ts` and `types.ts`. Follow that structure for new domain logic.
- AI calls: never call external LLMs directly from browser code. Use server/edge functions under `supabase/functions/` or an `edge/` folder and keep service-role secrets server-side.

Integration notes & gotchas
- Auth: the frontend mirrors session state via `auth.store` — use `useAuthStore.init()` when bootstrapping.
- Realtime & RLS: check `docs/ARCHITECTURE.md` for intended channels, policies, and RLS constraints before changing realtime flows.
- Storage: Supabase Storage rules and RLS live in DB migrations — update both code and migration SQL when introducing new buckets or rules.
- Secrets: the frontend uses anon keys only. Never commit `service_role` or server secrets to git.

Small PR contract (required content in AI-generated PRs)
1. Purpose: 1–2 sentence user-facing description.
2. Files changed: list and short reason.
3. DB: include SQL migration(s) in `supabase/migrations/` and document migration steps.
4. Env/secrets: list required env vars (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) and confirm no secrets are committed.
5. Test/verification: exact manual steps (run dev, seed minimal data, visit route, expected UI/behavior).

Example: creating a new page
1. Add `web/src/pages/MyNewPage.tsx` (React component).
2. Import it in `web/src/router.tsx` and add a route entry.
3. If it needs data, add a `usecases.ts` under `web/src/features/<feature>/` and call fetches via TanStack Query.
4. If DB changes are required, add a migration in `supabase/migrations/` and document how to run `supabase db push`.

Where to look first (short order)
1. `docs/ARCHITECTURE.md`
2. `web/src/services/supabase/client.ts` and `web/src/stores/auth.store.ts`
3. `web/src/router.tsx` and `web/src/pages/`
4. `supabase/migrations/`

If you're unsure: prefer the smallest, revertable change. Ask when touching auth, RLS, service_role, or DB schema.

Feedback: after this update, tell me any missing areas (tests, CI, or edge functions) and I will iterate.

