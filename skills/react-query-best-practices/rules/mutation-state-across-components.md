---
title: Read Mutation State Anywhere With useMutationState
impact: MEDIUM
impactDescription: show pending or finished mutations without prop drilling or extra global state
tags: mutation, useMutationState, mutationKey, optimistic
versions: v5
since: "5.0"
---

## Read Mutation State Anywhere With useMutationState

When the component that shows pending work is not the one that called `useMutation`, read that work from the MutationCache with `useMutationState`. Give the mutation a `mutationKey`, filter on it, and use `select` to pull out what you need. The result is an array, because several mutations can be running at the same time.

**Incorrect (copying mutation state into global state):**

```typescript
const { mutate } = useMutation({
  mutationFn: addTodo,
  onMutate: (text) => store.setPending((p) => [...p, text]),
  onSettled: (_d, _e, text) => store.setPending((p) => p.filter((t) => t !== text)),
});
```

**Correct (the mutation is the source of truth):**

```typescript
// in the form
const { mutate } = useMutation({
  mutationKey: ['addTodo'],
  mutationFn: (text: string) => api.addTodo(text),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
});

// in the list, anywhere in the tree
const pending = useMutationState<{ text: string; key: number }>({
  filters: { mutationKey: ['addTodo'], status: 'pending' },
  select: (m) => ({ text: m.state.variables as string, key: m.state.submittedAt }),
});

{pending.map((p) => <li key={p.key} style={{ opacity: 0.5 }}>{p.text}</li>)}
```

**Correct (global "saving…" indicator):**

```typescript
const isSaving = useMutationState({ filters: { status: 'pending' } }).length > 0;
// or simply: useIsMutating() > 0
```

- Filters accept `mutationKey`, `exact`, `status` and `predicate`.
- Define the key once with `mutationOptions` so the hook and the filter cannot drift apart (see `mutation-options-factory`).
- v4 has no `useMutationState`. Migrate first (`migration-single-signature`).

Reference: [Optimistic Updates](https://tanstack.com/query/v5/docs/framework/react/guides/optimistic-updates#if-the-mutation-and-the-query-dont-live-in-the-same-component) · [useMutationState](https://tanstack.com/query/v5/docs/framework/react/reference/functions/useMutationState) · [Filters](https://tanstack.com/query/v5/docs/framework/react/guides/filters#mutation-filters)
