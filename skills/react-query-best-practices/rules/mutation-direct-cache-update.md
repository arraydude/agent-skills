---
title: Update the Cache From Mutation Responses
impact: MEDIUM
impactDescription: instant UI update without an extra request
tags: mutation, cache, setQueryData, immutability
versions: v4, v5
---

## Update the Cache From Mutation Responses

When the mutation returns the updated object, write it to the cache with `setQueryData` instead of refetching data you already have. The updater can receive `undefined` when nothing is cached under that key. Handle that case, and always return new objects instead of mutating the old ones.

**Incorrect (crashes on an empty cache, and mutates in place):**

```typescript
onSuccess: (updated) => {
  queryClient.setQueryData(['todos', 'list'], (old: Todo[]) =>
    old.map((t) => (t.id === updated.id ? updated : t)), // old may be undefined
  );
  queryClient.setQueryData(['todos', 'detail', updated.id], (old) => {
    old.title = updated.title; // in-place mutation: subtle bugs
    return old;
  });
},
```

**Correct (handles undefined and stays immutable):**

```typescript
const mutation = useMutation({
  mutationFn: updateTodo,
  onSuccess: (updated) => {
    queryClient.setQueryData(['todos', 'detail', updated.id], updated);

    queryClient.setQueryData<Todo[]>(['todos', 'list'], (old) =>
      old ? old.map((t) => (t.id === updated.id ? updated : t)) : old,
    );
  },
});
```

**Combined with invalidation (patch what you know, refetch the rest):**

```typescript
onSuccess: (updated) => {
  queryClient.setQueryData(['todos', 'detail', updated.id], updated);
  // sorted or filtered lists may change order: let the server decide
  return queryClient.invalidateQueries({ queryKey: ['todos', 'list'] });
},
```

- If the updater returns `undefined`, `setQueryData` skips the write and does not create the query.
- To patch every list variant at once (filters, pages), use `queryClient.setQueriesData({ queryKey: ['todos', 'list'] }, updater)`.
- Prefer typed keys from `queryOptions` (v5) over annotating the `old` parameter (see `typescript-infer-dont-specify`).

Reference: [Updates from Mutation Responses](https://tanstack.com/query/v5/docs/framework/react/guides/updates-from-mutation-responses) · [QueryClient.setQueryData](https://tanstack.com/query/v5/docs/framework/react/reference/classes/QueryClient#setquerydata) · [v4 Updates from Mutation Responses](https://tanstack.com/query/v4/docs/framework/react/guides/updates-from-mutation-responses)
