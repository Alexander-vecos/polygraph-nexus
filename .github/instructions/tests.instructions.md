---
applyTo: "**/*.test.ts"
---

## Test File Requirements

When writing tests for this project, follow these guidelines to ensure consistency and maintainability:

### General Testing Principles
1. **Use Vitest**: All tests use Vitest with jsdom environment for DOM testing
2. **Test file naming**: Use `*.test.ts` suffix (e.g., `settings.usecases.test.ts`)
3. **Co-locate tests**: Place test files next to the code they test (e.g., `features/settings/settings.usecases.test.ts`)
4. **Write isolated tests**: Each test should be independent and not rely on other tests' state

### Test Structure
1. **Use descriptive test names**: Test names should clearly describe what is being tested
2. **Follow AAA pattern**: Arrange, Act, Assert
3. **Use `describe` blocks**: Group related tests together
4. **Test use cases, not implementation**: Focus on testing the behavior and outcomes

### Example Test Pattern
```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './my-module';

describe('MyModule', () => {
  it('should do something specific', async () => {
    // Arrange
    const input = { value: 'test' };
    
    // Act
    const result = await myFunction(input);
    
    // Assert
    expect(result).toHaveProperty('expectedProperty');
    expect(result.expectedProperty).toBe('expectedValue');
  });
});
```

### Testing Use Cases
- When testing use cases (`.usecases.ts` files), focus on testing the business logic
- Mock external dependencies (Supabase client, external APIs) when necessary
- Test both success and error cases
- Verify that use cases return the expected data structures

### Running Tests
- Run all tests: `npm run test` (from `web/` directory)
- Run tests in watch mode: `npm run test -- --watch`
- Run specific test file: `npm run test -- path/to/test.test.ts`
- CI runs tests with: `npm run test -- --run` (no watch mode)

### What to Test
1. **Use cases** (`*.usecases.ts`): Business logic and data transformations
2. **Utilities**: Pure functions and helper methods
3. **Stores**: State management logic (Zustand stores)
4. **Complex components**: Components with significant logic (use React Testing Library patterns if needed)

### What NOT to Test
- Simple components that only render props
- Third-party library internals
- Type definitions
- Configuration files

### Test Coverage
- Aim for meaningful coverage of critical paths
- Don't chase 100% coverage for its own sake
- Focus on testing behavior that matters to users
