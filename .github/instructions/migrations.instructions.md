---
applyTo: "supabase/migrations/*.sql"
---

## Database Migration Requirements

When creating or modifying Supabase migrations, follow these guidelines to ensure safe and maintainable database changes:

### Migration Principles
1. **Migrations are immutable**: Once a migration is applied, never edit it. Create a new migration instead
2. **Sequential naming**: Migrations are applied in chronological order based on the timestamp prefix
3. **Idempotent when possible**: Use `IF NOT EXISTS` and similar clauses to make migrations safer to retry
4. **Test locally first**: Always test migrations on local Supabase instance before deploying

### Creating Migrations
```bash
# Create a new migration file
npx supabase migration new <descriptive_name>

# Example:
npx supabase migration new add_orders_table
npx supabase migration new add_rls_policy_for_tasks
```

### Migration File Structure
```sql
-- Migration: <descriptive_name>
-- Description: Brief explanation of what this migration does
-- Date: YYYY-MM-DD

-- Create tables
CREATE TABLE IF NOT EXISTS public.my_table (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- other columns
);

-- Enable Row Level Security
ALTER TABLE public.my_table ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own data"
  ON public.my_table
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_my_table_user_id ON public.my_table(user_id);

-- Create triggers (if needed)
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.my_table
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
```

### Best Practices
1. **Always enable RLS**: Use `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;` for all user-facing tables
2. **Create proper indexes**: Add indexes for foreign keys and frequently queried columns
3. **Use `gen_random_uuid()`**: For UUID primary keys
4. **Add timestamps**: Include `created_at` and `updated_at` columns
5. **Document policies**: Add comments explaining the intent of RLS policies
6. **Foreign key constraints**: Use proper foreign key relationships with appropriate `ON DELETE` behavior

### Row Level Security (RLS)
- **anon key**: Should only work with properly configured RLS policies
- **service_role key**: Bypasses RLS (never expose in client code!)
- Test RLS policies thoroughly before deploying
- Common policy patterns:
  - Users see only their own data: `auth.uid() = user_id`
  - Organization-scoped: Join through membership/role tables
  - Public read: `FOR SELECT USING (true)`

### Applying Migrations
```bash
# Apply migrations to local database
npx supabase db push

# Reset local database (DESTRUCTIVE)
npx supabase db reset

# Check migration status
npx supabase migration list
```

### Migration Checklist
- [ ] Migration file has a descriptive name
- [ ] Tables have proper primary keys (UUID recommended)
- [ ] RLS is enabled on all relevant tables
- [ ] RLS policies are created and tested
- [ ] Indexes are added for performance
- [ ] Foreign key relationships are defined
- [ ] Timestamps (`created_at`, `updated_at`) are included
- [ ] Migration is tested locally with `npx supabase db push`
- [ ] Migration is documented in PR description

### Common Patterns

#### Creating a new table with RLS:
```sql
CREATE TABLE public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_members_can_view_orders"
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = orders.organization_id
      AND user_id = auth.uid()
    )
  );
```

#### Adding a column:
```sql
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft'::text;
```

#### Creating an index:
```sql
CREATE INDEX IF NOT EXISTS idx_orders_organization_id
ON public.orders(organization_id);
```

### Rollback Strategy
- Supabase doesn't have built-in rollback for migrations
- If a migration causes issues, create a new migration to reverse the changes
- Keep migrations small and focused to minimize rollback complexity
- Test migrations on a staging environment before production

### Documentation
- Update `docs/DATABASE_SCHEMA.md` when making significant schema changes
- Document any complex RLS policies in the migration file and in docs
- Include migration steps in PR description
