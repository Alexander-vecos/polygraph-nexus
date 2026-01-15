<!-- Use this template for small, focused PRs. Keep descriptions precise. -->
# Pull Request

## Purpose
One-sentence summary of the change and the user-visible effect.

## Changes
- Files changed (one per line) with a short reason for each.

## Database migrations
- If this PR requires DB changes include SQL in `supabase/migrations/` and reference the file(s) here.

## Environment / secrets
- List any new env vars required (e.g. `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
- Confirm no service_role or other secrets are committed.

## How to verify / Test steps
1. Commands to run (frontend/migrations/local supabase) and quick verification steps.
2. Routes to visit, example accounts, or expected API results.

## Screenshots (UI only)
- Add before/after screenshots or animated GIF.

## Rollback / Notes
- Short notes on how to revert if needed (migration rollback steps, feature flags, etc.).

---
### Example
See `.github/pr_examples/migration_pr_example.md` for a filled migration example that follows this contract.
