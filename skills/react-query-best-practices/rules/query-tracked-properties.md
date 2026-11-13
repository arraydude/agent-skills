---
title: Tracked Properties
impact: LOW
impactDescription: avoids re-renders from fields the component never reads
tags: query, optimization, rerender, eslint
versions: v4, v5
---

## Tracked Properties

The query result records which fields you read (a Proxy in v5, property getters in v4). The component re-renders only when one of those fields changes. Read only the fields you need, and never use object rest on the result.

**Incorrect (rest destructuring subscribes to every field):**

```typescript
const useTodos = () => {
  const { data: todos, ...rest } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });
  return { todos, ...rest }; // re-renders on every isFetching / isStale change
};
```

**Correct (destructure, or return the result object as-is):**

```typescript
const { data, isError } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });

// or keep the proxy intact and let the caller read what it needs
const useTodos = () => useQuery({ queryKey: ['todos'], queryFn: fetchTodos });
```

The result object itself is a new reference on every render; its fields keep their identity until they change. Put the fields you use in hook dependency arrays, not the whole result:

```typescript
const todosQuery = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });

useEffect(() => { /* ... */ }, [todosQuery]);      // Incorrect: runs every render
useEffect(() => { /* ... */ }, [todosQuery.data]); // Correct
```

- `notifyOnChangeProps` overrides tracking: set it to a list of fields, or `'all'` to turn the optimization off. With a manual list, you are responsible for choosing the fields.
- The ESLint rules `no-rest-destructuring` and `no-unstable-deps` (both in the v5 plugin's recommended config) catch these two mistakes (see `tooling-eslint-plugin`).

Reference: [Render Optimizations](https://tanstack.com/query/v5/docs/framework/react/guides/render-optimizations) · [no-rest-destructuring](https://tanstack.com/query/v5/docs/eslint/no-rest-destructuring) · [no-unstable-deps](https://tanstack.com/query/v5/docs/eslint/no-unstable-deps) · [v4 useQuery: notifyOnChangeProps](https://tanstack.com/query/v4/docs/framework/react/reference/useQuery)
