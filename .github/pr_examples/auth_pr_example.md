# Example PR — Auth: Improve session bootstrapping and token mirroring

Purpose
- Ensure session bootstrapping correctly mirrors Supabase session tokens into the `auth` store on app start and on `onAuthStateChange` events.

Files changed
- `web/src/stores/auth.store.ts` — adjust `useAuthStore.init()` and token mirroring logic.
- `web/src/services/supabase/client.ts` — small tweak to how the client reads initial session (if required).

Env / Secrets
- None new. Confirm frontend only uses anon key.

How to verify / Test steps
1. Start dev: `cd web && npm install && npm run dev`.
2. Sign in with a test user; confirm the UI shows an authenticated state.
3. Reload the page; confirm the session is persisted and `auth` store is populated without requiring a fresh login.
4. Open devtools -> Application -> Local Storage / Cookies and confirm tokens are mirrored only in allowed places (no service_role).

Notes for reviewers
- Check for any changes that may alter RLS behavior or require server-side updates.
- Keep changes small and focused; prefer non-breaking tweaks to bootstrap logic.

---
Follow the PR template when submitting (DB changes, env notes, test steps).
