## PolyGraph Nexus — Copilot instructions (concise)

Purpose: give AI agents the exact, discoverable facts they need to make small, safe PRs in this repo.

High-level: this repo is a PWA frontend (React + TypeScript + Vite) that talks to a Supabase backend (Postgres/Auth/Storage/Realtime).

Start reading (priority):
- `docs/ARCHITECTURE.md` — system design, offline-first strategy, AI layer.
- `docs/PROJECT_OVERVIEW.md` — domain model, MVP scope, glossary.
- `docs/COMPONENTS.md` — modules, pages, and UI patterns.

## PolyGraph Nexus — Copilot instructions (concise)

Purpose: give AI coding agents the exact, discoverable facts to make small, safe PRs in this repo.

At a glance
- Frontend: Progressive Web App built with React + TypeScript + Vite in `web/`.
- Backend: Supabase (Postgres, Auth, Storage, Realtime). Canonical schema lives in `supabase/migrations/`.

Quick dev commands
- Frontend dev (from repo root):
	- cd web && npm install && npm run dev
	- Build: cd web && npm run build
	- Preview production build: cd web && npm run preview
- Supabase local: use Supabase CLI for DB/migrations: `supabase start`, `supabase db push` or `supabase migrate`.

Key files you will touch
- `web/src/services/supabase/client.ts` — single shared Supabase client (requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).
- `web/src/stores/auth.store.ts` — zustand store; shows session init and `onAuthStateChange` pattern.
- `web/src/router.tsx` — route wiring; add pages under `web/src/pages/` and wire them here.
- `supabase/migrations/*.sql` — migrations are the source of truth for schema changes.

Conventions and patterns (project-specific)
- State: small logical stores use `zustand` (see `auth.store.ts`).
- Data fetching: prefer TanStack Query for async server state; simple queries may call `supabase` directly.
- Routing: pages live in `web/src/pages/*` and are registered in `web/src/router.tsx` rather than file-based routing.
- Secrets: frontend uses the anon key only. Never commit `service_role`; server/edge code must use service-role via environment variables.
- AI/edge work: AI calls should be proxied via server/edge functions (place under `supabase/functions/` or create `edge/`), not called directly from the browser.

Integration notes / gotchas
- Auth/session: client + `auth.store` mirror pattern; prefer `useAuthStore.init()` for session bootstrapping.
- Realtime: planned for tasks/chat; check `docs/ARCHITECTURE.md` for intended channels and RLS expectations.
- Storage: Supabase Storage used for assets — follow storage rules and RLS in DB migrations.

Small PR contract (what to include in a PR from an AI agent)
1. Purpose: 1–2 sentence summary of change and user-visible effect.
2. Files changed: list of modified paths and why.
3. DB: if schema changes, add SQL in `supabase/migrations/*.sql` and document migration steps.
4. Secrets/env: list new env vars (e.g., VITE_SUPABASE_*), and confirm no secrets are committed.
5. Test/verification: manual steps to verify (run dev server, seed data, expected UI route).

Where to look first (in order)
1. `docs/ARCHITECTURE.md` — architecture decisions and RLS/service-role guidance.
2. `web/src/services/supabase/client.ts` and `web/src/stores/auth.store.ts` — auth and client wiring.
3. `web/src/router.tsx` and `web/src/pages/` — UI entry points and patterns.
4. `supabase/migrations/` — DB contract.

If unsure: prefer the smallest, revertable change. Ask for clarification when a change touches security (auth, RLS, service_role) or DB schema.

Need more? Tell me which part of the stack you want an example PR for (UI, auth flow, migration, or edge function) and I'll draft it.

