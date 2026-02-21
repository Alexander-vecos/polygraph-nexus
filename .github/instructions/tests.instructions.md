---
applyTo: "web/src/**/*.test.{ts,tsx}"
---

## Test File Guidelines

When writing or modifying tests in this project, follow these guidelines:

### Testing Framework
- **Vitest** - Unit testing framework (Jest-compatible API)
- **jsdom** - DOM environment for component testing
- **React Testing Library** - For testing React components (when needed)

### Test File Structure
1. **File Naming** - Use `*.test.ts` or `*.test.tsx` suffix
2. **Co-location** - Place test files next to the code they test
3. **Descriptive Names** - Use clear, descriptive test names that explain what is being tested

### Test Organization
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('FeatureName', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  describe('specific functionality', () => {
    it('should do something specific', () => {
      // Arrange
      const input = /* setup */;
      
      // Act
      const result = /* execute */;
      
      // Assert
      expect(result).toBe(/* expected */);
    });
  });
});
```

### Best Practices
1. **AAA Pattern** - Arrange, Act, Assert structure for clarity
2. **Single Responsibility** - Each test should verify one thing
3. **Descriptive Assertions** - Use specific matchers like `toEqual`, `toContain`, `toHaveBeenCalledWith`
4. **Mock External Dependencies** - Mock Supabase client, external APIs, etc.
5. **Test Edge Cases** - Include tests for error conditions, empty states, boundary values
6. **Avoid Implementation Details** - Test behavior, not implementation

### Running Tests
```bash
cd web
npm run test              # Run tests in watch mode
npm run test -- --run     # Run tests once (CI mode)
npm run test -- MyTest    # Run specific test file
```

### What to Test
- **Use Cases** - Business logic in `*.usecases.ts` files (primary focus)
- **Utilities** - Helper functions and shared utilities
- **Components** - Complex component logic (when necessary)
- **Stores** - Zustand store actions and state updates

### Example Test
```typescript
import { describe, it, expect } from 'vitest';
import { calculateTotal } from './calculations';

describe('calculateTotal', () => {
  it('should sum all items correctly', () => {
    const items = [10, 20, 30];
    const result = calculateTotal(items);
    expect(result).toBe(60);
  });

  it('should return 0 for empty array', () => {
    const result = calculateTotal([]);
    expect(result).toBe(0);
  });
});
```

### Mocking Supabase
```typescript
import { vi } from 'vitest';

// Mock the Supabase client
vi.mock('@/services/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({ data: [], error: null })),
      insert: vi.fn(() => ({ data: [], error: null })),
    })),
  },
}));
```
