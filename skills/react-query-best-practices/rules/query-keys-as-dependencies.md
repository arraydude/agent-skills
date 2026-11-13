---
title: Query Keys as Dependencies
impact: CRITICAL
impactDescription: prevents cache collisions and data shown for the wrong parameters
tags: query, keys, dependencies, cache, eslint
versions: v4, v5
---

## Query Keys as Dependencies

Put every variable the `queryFn` reads, and that can change, into the `queryKey`. The key is the cache identity and acts like a dependency array. Each distinct value gets its own cache entry, and changing a value switches to that entry and refetches it, subject to `staleTime`.

**Incorrect (filters missing from the key):**

```typescript
const [filters, setFilters] = useState({ status: 'active' });

useQuery({
  queryKey: ['todos'], // every filter state shares one cache entry
  queryFn: () => fetchTodos(filters),
});
```

Changing `filters` does not change the key, so no new fetch starts. Every filter state reads and overwrites the same cached list.

**Correct (all dependencies in the key):**

```typescript
useQuery({
  queryKey: ['todos', filters],
  queryFn: () => fetchTodos(filters),
});
```

The same applies to query definitions built outside components:

```typescript
// Incorrect: id is used but not part of the key
const todoQueries = {
  detail: (id: number) => ({ queryKey: ['todo'], queryFn: () => api.getTodo(id) }),
};

// Correct
const todoQueries = {
  detail: (id: number) => ({ queryKey: ['todo', id], queryFn: () => api.getTodo(id) }),
};
```

- Keys must be arrays and serializable with `JSON.stringify`. Object keys are hashed deterministically, so property order inside an object does not matter. Array item order does matter: `['todos', status, page]` and `['todos', page, status]` are different keys.
- Function call targets are not dependencies: `fetchTodoById(todoId)` needs `todoId` in the key, not `fetchTodoById`.
- Let the linter enforce this: `@tanstack/query/exhaustive-deps` is part of the plugin's recommended config. Use `allowlist.variables` / `allowlist.types` (eslint-plugin-query 5.95+, not in the v4 plugin) for stable clients or config objects (see `tooling-eslint-plugin`).
- Centralize keys with a factory (`query-key-factory`) or `queryOptions` (`query-options-helper`, v5) so the key and the `queryFn` cannot drift apart.

Reference: [Query Keys](https://tanstack.com/query/v5/docs/framework/react/guides/query-keys) · [exhaustive-deps](https://tanstack.com/query/v5/docs/eslint/exhaustive-deps) · [v4 Query Keys](https://tanstack.com/query/v4/docs/framework/react/guides/query-keys)
