---
title: useErrorBoundary Renamed to throwOnError
impact: MEDIUM
impactDescription: breaking change; errors stop reaching the error boundary until renamed
tags: migration, v5, useErrorBoundary, throwOnError, errorBoundary, codemod
versions: v4, v5
---

## useErrorBoundary Renamed to throwOnError

v5 renamed the `useErrorBoundary` option to `throwOnError` on queries and mutations. The new name avoids the hook-style `use` prefix and describes what the option does: it re-throws the error so the nearest error boundary catches it. It still accepts a boolean or a function.

**v4 (before):**

```typescript
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  // only throw when there is no cached data to show
  useErrorBoundary: (error, query) => typeof query.state.data === 'undefined',
});

useMutation({ mutationFn: postTodo, useErrorBoundary: true });
```

**v5 (after):**

```typescript
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  throwOnError: (error, query) => typeof query.state.data === 'undefined',
});

useMutation({ mutationFn: postTodo, throwOnError: true });
```

**Codemod (`rename-properties`, also renames `cacheTime` → `gcTime`):**

```bash
npx jscodeshift@latest ./src --extensions=ts,tsx --parser=tsx \
  --transform=./node_modules/@tanstack/react-query/build/codemods/v5/rename-properties/rename-properties.cjs
```

Reference: [Migrating to v5](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5#the-useerrorboundary-option-has-been-renamed-to-throwonerror)
