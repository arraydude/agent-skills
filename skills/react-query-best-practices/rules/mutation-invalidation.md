---
title: Invalidate Queries After Mutations
impact: CRITICAL
impactDescription: every component showing the changed data gets fresh data
tags: mutation, invalidation, invalidateQueries, cache
versions: v4, v5
---

## Invalidate Queries After Mutations

After a mutation succeeds, call `invalidateQueries` with the key prefix it affects. This marks every matching query stale, even one with a long `staleTime` (v5 `staleTime: 'static'` is the exception), and refetches the ones currently on screen. Return or `await` the promise so the mutation stays pending until that refetch finishes.

**Incorrect (refetching one observer by hand):**

```typescript
const { refetch } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });
const mutation = useMutation({
  mutationFn: updateTodo,
  onSuccess: () => refetch(), // misses ['todos', { page: 2 }], details, etc.
});
```

**Correct (invalidate by prefix and await it):**

```typescript
const mutation = useMutation({
  mutationFn: updateTodo,
  onSuccess: async () => {
    // matches ['todos'], ['todos', { page: 1 }], ['todos', 5] ...
    await queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

**Correct (several keys at once):**

```typescript
onSuccess: () =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: ['todos'] }),
    queryClient.invalidateQueries({ queryKey: ['reminders'] }),
  ]),
```

**Keep the button disabled until the data is fresh:**

```typescript
// v5
<button disabled={mutation.isPending}>Save</button>
// v4
<button disabled={mutation.isLoading}>Save</button> {/* v4.40+: isPending */}
```

- By default only active queries refetch (`refetchType: 'active'`). Use `'all'`, `'inactive'` or `'none'` to change that. Use `exact: true` or a `predicate` for narrower matches.
- The returned promise resolves once the refetch settles. It does not reject on refetch errors unless you pass `{ throwOnError: true }` as the second argument.

Reference: [Invalidations from Mutations](https://tanstack.com/query/v5/docs/framework/react/guides/invalidations-from-mutations) · [Query Invalidation](https://tanstack.com/query/v5/docs/framework/react/guides/query-invalidation) · [v4 Invalidations from Mutations](https://tanstack.com/query/v4/docs/framework/react/guides/invalidations-from-mutations)
