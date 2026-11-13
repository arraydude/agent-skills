---
title: Optimistic UI via Mutation Variables
impact: HIGH
impactDescription: instant feedback without writing to the cache or handling rollback
tags: mutation, optimistic, variables, isPending
versions: v4, v5
---

## Optimistic UI via Mutation Variables

When only one component shows the pending change, render it from the mutation's own `variables` while the mutation is pending, instead of writing it into the cache. Nothing in the cache changes, so there is nothing to roll back: if the mutation fails, the temporary item disappears. Return the invalidation from `onSettled` so the item stays visible until the refetched list contains the real one.

**Incorrect (cache surgery for a single list item):**

```typescript
onMutate: async (text) => {
  await queryClient.cancelQueries({ queryKey: ['todos'] });
  const previous = queryClient.getQueryData(['todos']);
  queryClient.setQueryData(['todos'], (old) => [...(old ?? []), { id: 'tmp', text }]);
  return { previous };
},
// ...plus onError rollback, for one component that shows the item
```

**Correct (v5):**

```typescript
const { mutate, isPending, isError, variables, submittedAt } = useMutation({
  mutationFn: (text: string) => api.addTodo(text),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
});

<ul>
  {todos.map((t) => <li key={t.id}>{t.text}</li>)}
  {isPending && <li key={submittedAt} style={{ opacity: 0.5 }}>{variables}</li>}
  {isError && (
    <li style={{ color: 'red' }}>
      {variables} <button onClick={() => mutate(variables)}>Retry</button>
    </li>
  )}
</ul>
```

**Correct (v4; use `isLoading` before 4.40):**

```typescript
const { isPending, variables } = useMutation({
  mutationFn: (text: string) => api.addTodo(text),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
});

{isPending && <li style={{ opacity: 0.5 }}>{variables}</li>}
```

- `variables` are kept after an error, so you can offer a retry (v4 types them `TVariables | undefined` in every status, so pass `variables!`). v5's `submittedAt` gives each pending item a stable key.
- When several components need to show the update, write to the cache instead (`mutation-optimistic-updates`). When the mutation runs in a different component from the list, use `mutation-state-across-components` (v5).
- The v4 docs describe only the cache-based approach, but v4 exposes `variables` on the result from 4.0 (it is part of the mutation state, set before `onMutate` runs). `submittedAt` is v5-only.

Reference: [Optimistic Updates: Via the UI](https://tanstack.com/query/v5/docs/framework/react/guides/optimistic-updates#via-the-ui) · [Migrating to v5: Simplified optimistic updates](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5#simplified-optimistic-updates)
