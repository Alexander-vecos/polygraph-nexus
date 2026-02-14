---
applyTo: "web/src/features/**/*.usecases.ts"
---

## Use Case Guidelines

Use case files contain the business logic and domain operations for features. Follow these guidelines:

### Purpose
- Orchestrate interactions between the UI layer and data layer
- Implement business rules and validation
- Keep business logic separate from UI components
- Provide a clean API for components to interact with domain logic

### File Structure
1. **Location** - Place in `web/src/features/<feature-name>/<feature>.usecases.ts`
2. **Dependencies** - Import from `types.ts`, Supabase client, and stores
3. **Exports** - Export pure functions or object with methods
4. **No UI Logic** - Keep UI concerns (React hooks, components) out of use cases

### Patterns
```typescript
import { supabase } from '@/services/supabase/client';
import type { Order, OrderCreateInput } from './types';

/**
 * Creates a new order with validation
 */
export async function createOrder(input: OrderCreateInput): Promise<Order> {
  // 1. Validate input
  if (!input.title || input.title.trim() === '') {
    throw new Error('Order title is required');
  }

  // 2. Prepare data
  const orderData = {
    title: input.title,
    description: input.description,
    status: 'draft',
    created_at: new Date().toISOString(),
  };

  // 3. Persist to database
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (error) throw error;
  
  // 4. Return typed result
  return data as Order;
}

/**
 * Updates order status with business rules
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: string
): Promise<void> {
  // Business rule: check if transition is valid
  const { data: order } = await supabase
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single();

  if (!order) throw new Error('Order not found');
  
  // Validate status transition
  if (!isValidStatusTransition(order.status, newStatus)) {
    throw new Error(`Cannot transition from ${order.status} to ${newStatus}`);
  }

  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (error) throw error;
}

function isValidStatusTransition(from: string, to: string): boolean {
  const validTransitions: Record<string, string[]> = {
    draft: ['confirmed'],
    confirmed: ['in_production'],
    in_production: ['qc', 'cancelled'],
    qc: ['packed', 'rework'],
    // ... more transitions
  };
  
  return validTransitions[from]?.includes(to) ?? false;
}
```

### Best Practices
1. **Pure Functions** - Prefer pure functions for testability
2. **Error Handling** - Throw descriptive errors, let caller handle them
3. **Validation** - Validate inputs at the use case boundary
4. **Type Safety** - Use TypeScript types from `types.ts`
5. **Single Responsibility** - One use case per function
6. **Async/Await** - Use async/await for database operations
7. **Business Rules** - Encode domain rules in use cases, not UI
8. **Documentation** - Add JSDoc comments for public use cases

### Testing Use Cases
- Use cases should have accompanying `*.usecases.test.ts` files
- Mock Supabase client for unit tests
- Test business logic thoroughly
- Test error cases and validation

### Integration with Components
```tsx
// In a React component
import { createOrder } from '@/features/orders/orders.usecases';
import { useMutation } from '@tanstack/react-query';

function OrderForm() {
  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      // Handle success
    },
    onError: (error) => {
      // Handle error
    },
  });

  const handleSubmit = (data: OrderCreateInput) => {
    mutation.mutate(data);
  };

  // ... rest of component
}
```

### Don't
- ❌ Don't import React or use React hooks in use cases
- ❌ Don't handle UI state (loading, error messages) in use cases
- ❌ Don't use `useAuthStore` or other stores directly (pass data as parameters)
- ❌ Don't make use cases too generic or too specific

### Do
- ✅ Keep use cases focused on business logic
- ✅ Return typed results
- ✅ Throw errors for exceptional cases
- ✅ Validate inputs
- ✅ Write comprehensive tests
