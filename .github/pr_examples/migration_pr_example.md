# Example PR — Migration: Add `display_name` to `profiles`

Purpose
- Add a nullable `display_name` column to `profiles` to support user-friendly names in the UI.

Files changed
- `supabase/migrations/20260115120000_add_profile_display_name.sql` — new SQL migration (see snippet below)

DB migration (snippet)
```sql
-- supabase/migrations/20260115120000_add_profile_display_name.sql
ALTER TABLE profiles
ADD COLUMN display_name text;
```

Env / Secrets
- None new for this change. Confirm that no `service_role` is added to frontend code.

How to verify / Test steps
1. Start local Supabase and apply migrations:
   - `supabase start`
   - `supabase db push` (or `supabase migrate` depending on your flow)
2. Run frontend dev:
   - `cd web && npm install && npm run dev`
3. Verify DB schema: connect to the local DB and confirm `profiles` has the `display_name` column.
4. In the app, visit a profile edit page (or the dashboard) and verify the new field is read/writable where applicable.

Rollback notes
- To revert: add a follow-up migration that drops the column or restore DB from a backup/snapshot (document whichever fits your migration policy).

Notes for reviewers
- Check migration syntax and RLS impact (if `profiles` is used in any RLS policies, update them as needed).
- Confirm frontend usage is optional for older records (nullable column chosen deliberately).

---
This example demonstrates the expected PR structure for DB changes — include an explanatory purpose, explicit file list, the migration SQL in `supabase/migrations/`, env notes, verification steps, and rollback guidance.
