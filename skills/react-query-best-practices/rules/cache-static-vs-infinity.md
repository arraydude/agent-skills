---
title: staleTime 'static' vs Infinity
impact: MEDIUM
impactDescription: choose whether manual invalidation can still refresh the data
tags: cache, staleTime, static, invalidation
versions: v5
since: "5.79"
---

## staleTime 'static' vs Infinity

Both values stop staleness-based refetches. Use `Infinity` when the data changes only through your own invalidation, for example WebSocket events or mutations. Use `'static'` (since 5.79, #9139) for data that cannot change while the app runs. With `'static'`, `invalidateQueries` has no effect, and `refetchOnMount`, `refetchOnWindowFocus` and `refetchOnReconnect` set to `'always'` are blocked as well.

**Incorrect (`'static'` on data that mutations update):**

```typescript
useQuery({ queryKey: ['todos'], queryFn: fetchTodos, staleTime: 'static' });

useMutation({
  mutationFn: addTodo,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }), // ignored by 'static'
});
```

**Correct:**

```typescript
// Changes only when we invalidate it: invalidation still works
useQuery({ queryKey: ['todos'], queryFn: fetchTodos, staleTime: Infinity });

// Fixed for the session: feature flags at boot, permissions at login, reference tables
useQuery({ queryKey: ['feature-flags'], queryFn: fetchFlags, staleTime: 'static' });
```

- `staleTime` can also be a function returning a number or `'static'` per query (5.44+).
- `queryClient.query({ ...options, staleTime: 'static' })` is the replacement for `ensureQueryData`: it returns cached data if any exists (see `query-imperative-query-method`).
- `'static'` is not garbage-collection protection. Inactive queries are still removed after `gcTime`.
- v4 accepts only numbers. Use `Infinity` there (see `cache-stale-time`).

Reference: [Important Defaults](https://tanstack.com/query/v5/docs/framework/react/guides/important-defaults) · [useQuery: staleTime](https://tanstack.com/query/v5/docs/framework/react/reference/functions/useQuery)
