---
applyTo: "supabase/migrations/*.sql"
---

## Database Migration Guidelines

When creating or modifying database migrations, follow these guidelines:

### Migration Files
1. **Naming** - Supabase CLI generates names like `YYYYMMDDHHMMSS_description.sql`
2. **Creation** - Use `supabase migration new <description>` to create new migrations
3. **Order** - Migrations run in chronological order based on timestamp
4. **Idempotency** - Migrations should be safe to run multiple times when possible

### Migration Structure
```sql
-- Description: Add orders table with RLS policies
-- Created: 2026-02-14

-- Create table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_orders_organization_id ON orders(organization_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view orders in their organization"
  ON orders FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create orders in their organization"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Add triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### RLS (Row Level Security) Best Practices
1. **Always Enable RLS** - Every table should have RLS enabled
2. **Principle of Least Privilege** - Grant only necessary permissions
3. **Organization Scoping** - Use organization membership for multi-tenant access
4. **Auth Context** - Use `auth.uid()` to get current user ID
5. **Performance** - Add indexes on columns used in RLS policies
6. **Testing** - Test RLS policies with different user roles

### Common Patterns

#### Timestamps
```sql
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

#### Foreign Keys with Cascade
```sql
organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE
```

#### Enums (use CHECK constraints or separate table)
```sql
-- Option 1: CHECK constraint
status TEXT NOT NULL CHECK (status IN ('draft', 'confirmed', 'in_production', 'completed'))

-- Option 2: Reference table (preferred for larger sets)
CREATE TABLE order_statuses (
  value TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT
);
```

#### Updated At Trigger
```sql
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON table_name
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### Testing Migrations
```bash
# Apply migrations to local database
supabase db push

# Reset local database and reapply all migrations
supabase db reset

# Check migration status
supabase migration list
```

### Migration Checklist
- [ ] Migration file has descriptive name
- [ ] Tables have primary keys
- [ ] Foreign keys have appropriate ON DELETE behavior
- [ ] Indexes added for foreign keys and commonly queried columns
- [ ] RLS enabled on all tables
- [ ] RLS policies defined for SELECT, INSERT, UPDATE, DELETE
- [ ] Timestamps (created_at, updated_at) added where needed
- [ ] Update triggers added for updated_at columns
- [ ] Migration tested locally with `supabase db reset`
- [ ] Migration is idempotent where possible (IF NOT EXISTS)

### Don't
- ❌ Don't modify existing migration files after they're applied
- ❌ Don't commit service_role key or secrets
- ❌ Don't forget to enable RLS on new tables
- ❌ Don't use SELECT * in production code (specify columns)
- ❌ Don't create tables without indexes on foreign keys

### Do
- ✅ Create new migration file for changes
- ✅ Test migrations locally before pushing
- ✅ Document complex RLS policies with comments
- ✅ Use transactions for multi-step migrations
- ✅ Add rollback instructions in comments if needed
- ✅ Use appropriate data types (UUID for IDs, TIMESTAMPTZ for timestamps)
