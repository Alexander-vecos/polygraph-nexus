---
applyTo: "web/src/**/*.tsx"
---

## React Component Guidelines

When creating or modifying React components in this project, follow these guidelines:

### Component Structure
1. **Functional Components** - Use functional components with hooks (React 19)
2. **TypeScript** - All components must be properly typed with TypeScript
3. **Props Interface** - Define props interface/type above component definition
4. **File Organization** - One component per file, named exports preferred for main components

### Styling
1. **Tailwind CSS** - Use Tailwind utility classes for styling when applicable
2. **CSS Modules** - Use `.module.css` for component-specific styles if needed
3. **Consistent Spacing** - Follow existing spacing conventions in the codebase

### State Management
1. **Local State** - Use `useState` for component-local state
2. **Global State** - Use Zustand stores (in `web/src/stores/`) for app-wide state
3. **Server State** - Use TanStack Query for data fetching and caching
4. **Form State** - Handle form state with controlled components

### Data Fetching
1. **TanStack Query** - Prefer `useQuery` and `useMutation` hooks for server data
2. **Supabase Client** - Import from `web/src/services/supabase/client.ts`
3. **Error Handling** - Always handle loading and error states in UI

### Best Practices
1. **Accessibility** - Use semantic HTML and ARIA labels where appropriate
2. **Performance** - Use `React.memo()`, `useMemo()`, `useCallback()` only when needed
3. **Code Splitting** - Lazy load heavy components with `React.lazy()` when appropriate
4. **Clean Code** - Keep components focused and single-responsibility
5. **Comments** - Add JSDoc comments for complex components or props

### Example Pattern
```tsx
interface MyComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
}

export function MyComponent({ title, onSubmit }: MyComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{title}</h2>
      {/* Component content */}
    </div>
  );
}
```
