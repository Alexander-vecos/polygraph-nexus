# Example PR — UI: Add Settings page (theme toggle)

Purpose
- Add a simple `Settings` page that lets users toggle a light/dark theme; this demonstrates adding a page and wiring it into the router.

Files changed
- `web/src/pages/SettingsPage.tsx` — new React component for settings UI.
- `web/src/router.tsx` — import and register the `/settings` route.
- `web/src/features/settings/settings.usecases.ts` — small usecase to persist the chosen theme (localStorage or supabase user meta).

Env / Secrets
- None.

How to verify / Test steps
1. Run dev server:
   - `cd web && npm install && npm run dev`
2. Visit `http://localhost:5173/settings` (or the configured dev host) and toggle the theme.
3. Confirm the theme persists across reloads and that no console errors are thrown.

Screenshots
- Attach before/after screenshots for reviewers if the change affects visuals.

Notes for reviewers
- Verify route registration in `web/src/router.tsx` follows existing route patterns.
- Prefer minimal styling and reuse shared layout `web/src/shared/layout/AppShell.tsx`.

---
This UI example follows the PR contract in `.github/PULL_REQUEST_TEMPLATE.md`.
