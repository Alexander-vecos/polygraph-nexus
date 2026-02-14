---
applyTo: "web/src/features/**/types.ts"
---

## TypeScript Types Guidelines

Type definition files contain the domain models and interfaces for features. Follow these guidelines:

### Purpose
- Define domain entities and their shapes
- Provide type safety across the application
- Document the data structure
- Serve as single source of truth for feature types

### File Structure
1. **Location** - Place in `web/src/features/<feature-name>/types.ts`
2. **Naming** - Use PascalCase for types and interfaces
3. **Organization** - Group related types together
4. **Exports** - Export all types (they should be reusable)

### Type Definitions
```typescript
/**
 * Core domain entity
 */
export interface Order {
  id: string;
  title: string;
  description: string | null;
  status: OrderStatus;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Status enum (matches database constraint)
 */
export type OrderStatus = 
  | 'draft' 
  | 'confirmed' 
  | 'in_production' 
  | 'qc' 
  | 'packed' 
  | 'shipped' 
  | 'completed'
  | 'cancelled';

/**
 * Input type for creating a new order
 */
export interface OrderCreateInput {
  title: string;
  description?: string;
  organizationId: string;
}

/**
 * Input type for updating an order
 */
export interface OrderUpdateInput {
  title?: string;
  description?: string;
  status?: OrderStatus;
}

/**
 * Order with related data for display
 */
export interface OrderWithDetails extends Order {
  organization: {
    id: string;
    name: string;
  };
  creator: {
    id: string;
    email: string;
  };
  taskCount: number;
}

/**
 * Filter params for order queries
 */
export interface OrderFilters {
  status?: OrderStatus;
  organizationId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}
```

### Best Practices
1. **Interface vs Type**
   - Use `interface` for object shapes (preferred)
   - Use `type` for unions, intersections, or primitives
   
2. **Naming Conventions**
   - Entity: `Order`, `Task`, `User`
   - Input: `OrderCreateInput`, `OrderUpdateInput`
   - With relations: `OrderWithDetails`, `TaskWithAssignee`
   - Filters: `OrderFilters`, `TaskFilters`
   - Status/Enum: `OrderStatus`, `TaskPriority`

3. **Null vs Undefined**
   - Use `null` for database fields that can be NULL
   - Use `undefined` for optional parameters/properties
   - Use `string | null` for nullable database fields
   - Use `string?` or `string | undefined` for optional properties

4. **Database Mapping**
   - Match database column names (camelCase in TS, snake_case in DB)
   - Document any discrepancies
   - Use the same types as Supabase generates

5. **Documentation**
   - Add JSDoc comments for complex types
   - Document business rules in comments
   - Link to related database tables

### Example: Complete Feature Types
```typescript
/**
 * Task represents a unit of work in an order
 * Database table: tasks
 */
export interface Task {
  id: string;
  orderId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskCreateInput {
  orderId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  assignedTo?: string;
  dueDate?: string;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  dueDate?: string;
}

export interface TaskWithRelations extends Task {
  order: {
    id: string;
    title: string;
  };
  assignee: {
    id: string;
    email: string;
  } | null;
}

export interface TaskFilters {
  orderId?: string;
  status?: TaskStatus;
  assignedTo?: string;
  priority?: TaskPriority;
}

/**
 * Task statistics for dashboard
 */
export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  blocked: number;
}
```

### Integration with Supabase
```typescript
// Supabase returns snake_case, we use camelCase
// Transform in use cases or create helper
import type { Database } from '@/types/supabase';

type TaskRow = Database['public']['Tables']['tasks']['Row'];

export function fromTaskRow(row: TaskRow): Task {
  return {
    id: row.id,
    orderId: row.order_id,
    title: row.title,
    description: row.description,
    status: row.status as TaskStatus,
    priority: row.priority as TaskPriority,
    assignedTo: row.assigned_to,
    dueDate: row.due_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
```

### Don't
- ❌ Don't use `any` type
- ❌ Don't duplicate type definitions across features
- ❌ Don't use `{}` for object types (use `Record<string, unknown>`)
- ❌ Don't add logic to type files (keep them pure types)

### Do
- ✅ Use strict TypeScript settings
- ✅ Export all types that might be used elsewhere
- ✅ Document complex types with JSDoc
- ✅ Keep types in sync with database schema
- ✅ Use utility types (`Partial`, `Pick`, `Omit`) when appropriate
