## PolyGraph Nexus — Copilot instructions

Purpose: Give AI agents the exact, discoverable facts needed to make small, safe PRs in this repo (frontend-first PWA with Supabase backend).

## Quick Architecture Summary
- **Frontend**: Progressive Web App (PWA) — React 19 + TypeScript + Vite located in `web/` (offline-first behaviour in `web/src/offline`)
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime). Schema and triggers live in `supabase/migrations/`
- **State Management**: Zustand for client state, TanStack Query for server state
- **Routing**: React Router with explicit route registration (not file-based)

## Code Standards

### Required Before Each Commit
- Run linting: `cd web && npm run lint` before committing any changes
- Run tests: `cd web && npm run test` to ensure no regressions
- Build check: `cd web && npm run build` to verify TypeScript compilation

### Development Flow
- Development: `cd web && npm run dev` (starts Vite dev server with PWA support)
- Test: `cd web && npm run test` (runs Vitest with jsdom environment)
- Test in watch mode: `cd web && npm run test -- --watch`
- Build: `cd web && npm run build` (TypeScript compilation + Vite build)
- Preview: `cd web && npm run preview` (preview production build locally)

### Supabase Development
- Local Supabase: `npx supabase start` (requires Docker)
- Apply migrations: `npx supabase db push`
- Create migration: `npx supabase migration new <descriptive_name>`
- Stop Supabase: `npx supabase stop`

## Repository Structure
- `web/`: Frontend React PWA application
  - `web/src/pages/`: Page components (register routes in `router.tsx`)
  - `web/src/features/`: Domain features with use cases and types
  - `web/src/stores/`: Zustand state stores
  - `web/src/services/`: External service integrations (Supabase client)
  - `web/src/offline/`: PWA and offline functionality
- `supabase/`: Backend configuration and migrations
  - `supabase/migrations/`: SQL migration files (version controlled)
  - `supabase/config.toml`: Supabase project configuration
- `docs/`: Project documentation
- `.github/`: GitHub workflows, templates, and instructions

### Where to Start (Highest Priority)
- `docs/ARCHITECTURE.md` — system design, RLS and service-role guidance, offline strategy, and AI layer
- `docs/PROJECT_OVERVIEW.md` — domain model and MVP scope
- `web/README.md` and `web/src/pages/README.md` — local frontend conventions and page patterns

## Key Files & Examples (What to Touch in Practice)
- `web/src/services/supabase/client.ts` — single shared Supabase client. Uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. (Do not embed service_role in frontend code)
- `web/src/stores/auth.store.ts` — Zustand store showing session bootstrapping (`useAuthStore.init()`), `onAuthStateChange` pattern and token mirroring
- `web/src/router.tsx` — routes are registered here (not file-based routing). Add new pages under `web/src/pages/` and import them into this file
- `web/src/offline/index.ts` — PWA/offline wiring (service-worker, caching strategies)
- `web/src/features/*/*.usecases.ts` — domain use-cases live next to feature types (e.g., `features/chat/chat.usecases.ts`)
- `supabase/migrations/*.sql` — DB schema is canonical; include SQL migrations for any schema changes

## Developer Workflows (Quick Commands)

### Frontend Development (from repo root):
```bash
cd web
npm install      # Install dependencies
npm run dev      # Start development server with hot reload
npm run build    # Production build (TypeScript + Vite)
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run test     # Run tests with Vitest
```

### Supabase Local Development:
```bash
npx supabase start          # Start local Supabase (requires Docker)
npx supabase db push        # Apply migrations to local database
npx supabase migration new <descriptive_name>  # Create new migration
npx supabase stop           # Stop local Supabase
```

## Conventions & Patterns (Project-Specific)
- **State**: Small logical stores use Zustand (see `auth.store.ts`). Keep stores focused and testable
- **Data fetching**: Prefer TanStack Query for cached async server state; small helpers may call the shared `supabase` client directly
- **Routing**: Explicit route registration in `web/src/router.tsx` — add imports and route entries there
- **Features**: Each feature folder contains `*.usecases.ts` and `types.ts`. Follow that structure for new domain logic
- **AI calls**: Never call external LLMs directly from browser code. Use server/edge functions under `supabase/functions/` or an `edge/` folder and keep service-role secrets server-side
- **Testing**: Use Vitest with jsdom environment. Write unit tests for use cases. Follow the pattern in `web/src/features/settings/settings.usecases.test.ts`
- **TypeScript**: Strict mode enabled. Use proper types, avoid `any`

## Integration Notes & Gotchas
- **Auth**: The frontend mirrors session state via `auth.store` — use `useAuthStore.init()` when bootstrapping
- **Realtime & RLS**: Check `docs/ARCHITECTURE.md` for intended channels, policies, and RLS constraints before changing realtime flows
- **Storage**: Supabase Storage rules and RLS live in DB migrations — update both code and migration SQL when introducing new buckets or rules
- **Secrets**: The frontend uses anon keys only. Never commit `service_role` or server secrets to git. Environment variables should be prefixed with `VITE_` to be accessible in the browser

## Small PR Contract (Required Content in AI-Generated PRs)
1. **Purpose**: 1–2 sentence user-facing description
2. **Files changed**: List and short reason for each change
3. **Database**: Include SQL migration(s) in `supabase/migrations/` and document migration steps (if applicable)
4. **Environment/Secrets**: List required env vars (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) and confirm no secrets are committed
5. **Test/Verification**: Exact manual steps (run dev, seed minimal data, visit route, expected UI/behavior)
6. **Tests**: Include unit tests for new functionality. Use Vitest with the existing patterns

## Key Guidelines
1. **Make minimal changes**: Only modify what's necessary to solve the issue
2. **Follow existing patterns**: Match the code style and structure already in the repo
3. **Test your changes**: Run `npm run test` and `npm run build` before committing
4. **Update documentation**: If you change APIs or add features, update relevant docs
5. **Write tests for new functionality**: Use Vitest with table-driven tests when appropriate
6. **Maintain existing code structure**: Don't refactor unless explicitly required
7. **Document complex logic**: Add comments for non-obvious implementations

## Example: Creating a New Page
1. Add `web/src/pages/MyNewPage.tsx` (React component)
2. Import it in `web/src/router.tsx` and add a route entry
3. If it needs data, add a `usecases.ts` under `web/src/features/<feature>/` and call fetches via TanStack Query
4. Add tests in `web/src/features/<feature>/<feature>.usecases.test.ts`
5. If DB changes are required, add a migration in `supabase/migrations/` and document how to run `npx supabase db push`

## Where to Look First (Short Order)
1. `docs/ARCHITECTURE.md` — understand the system design
2. `web/src/services/supabase/client.ts` and `web/src/stores/auth.store.ts` — see how Supabase integration works
3. `web/src/router.tsx` and `web/src/pages/` — understand routing
4. `supabase/migrations/` — see database schema
5. `web/src/features/settings/settings.usecases.test.ts` — example test file

## If You're Unsure
- Prefer the smallest, revertible change
- Ask when touching auth, RLS, service_role, or DB schema
- Review existing code patterns before implementing new features
- Check documentation in `docs/` for domain knowledge
