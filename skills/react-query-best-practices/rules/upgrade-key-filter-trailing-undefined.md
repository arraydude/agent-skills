---
title: Drop Trailing undefined from Partial Key Filters
impact: HIGH
impactDescription: invalidations that silently stop matching after 5.103
tags: upgrade, v5, query-key, filters, invalidateQueries, key-factory
versions: v5
since: "5.103"
---

## Drop Trailing undefined from Partial Key Filters

Since 5.103, a partial-match filter key that is *longer* than a cached key, because its extra trailing elements are `undefined`, no longer matches that shorter key. Before, `['todos', undefined]` matched `['todos']`. Key factories with optional parameters create these filters easily, and nothing reports it: the invalidation simply stops hitting the query. Build filter keys without trailing `undefined`, or invalidate by the shared prefix.

**Incorrect (relies on pre-5.103 matching):**

```typescript
const todoKeys = {
  all: ['todos'] as const,
  list: (filter?: string) => ['todos', filter] as const,
};

useQuery({ queryKey: todoKeys.all, queryFn: fetchAllTodos });

// filter is undefined → ['todos', undefined]
queryClient.invalidateQueries({ queryKey: todoKeys.list(filter) });
// ≤5.102: invalidated ['todos'] · ≥5.103: no longer matches ['todos']
```

**Correct (no trailing undefined in the filter):**

```typescript
const todoKeys = {
  all: ['todos'] as const,
  list: (filter?: string) =>
    filter === undefined ? (['todos', 'list'] as const) : (['todos', 'list', filter] as const),
};

// invalidate everything under the prefix
queryClient.invalidateQueries({ queryKey: todoKeys.all });
```

- Audit every filter-taking call (`invalidateQueries`, `refetchQueries`, `cancelQueries`, `removeQueries`, `resetQueries`, `setQueriesData`, `useIsFetching`, `useMutationState`) whose key is built from optional arguments.
- Prefix matching is otherwise unchanged. `['todos']` still matches `['todos', 'list', 'done']`.

Reference: [Query Filters](https://tanstack.com/query/v5/docs/framework/react/guides/filters) · [PR #11502](https://github.com/TanStack/query/pull/11502)
