---
title: Optimistic Updates via the Cache
impact: HIGH
impactDescription: instant feedback everywhere the data is shown, with rollback
tags: mutation, optimistic, onMutate, rollback, cancelQueries
versions: v4, v5
---

## Optimistic Updates via the Cache

When several places on screen show the changed data, write the expected result into the cache in `onMutate`. Steps: cancel in-flight fetches for that key so they don't overwrite your update, snapshot the old value, return the snapshot, restore it in `onError`, then invalidate in `onSettled`. Return the invalidate promise so the mutation stays pending until the refetch finishes. If only one component shows the pending item, the simpler `variables` approach is enough (see `mutation-optimistic-via-variables`).

**Incorrect (no cancel, no rollback, and the invalidation is not returned):**

```typescript
useMutation({
  mutationFn: updateTodo,
  onMutate: (newTodo) => {
    queryClient.setQueryData(['todos', newTodo.id], newTodo); // an in-flight fetch can overwrite this
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] }); // not returned: isPending ends too early
  },
});
```

**Correct (v5.89+: `onMutate(variables, context)` and `onError(error, variables, onMutateResult, context)`):**

```typescript
useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo, context) => {
    await context.client.cancelQueries({ queryKey: ['todos', newTodo.id] });
    const previousTodo = context.client.getQueryData(['todos', newTodo.id]);
    context.client.setQueryData(['todos', newTodo.id], newTodo);
    return { previousTodo }; // becomes `onMutateResult`
  },
  onError: (err, newTodo, onMutateResult, context) => {
    context.client.setQueryData(['todos', newTodo.id], onMutateResult?.previousTodo);
  },
  onSettled: (data, error, newTodo, onMutateResult, context) =>
    context.client.invalidateQueries({ queryKey: ['todos', newTodo.id] }),
});
```

**Correct (v4, and v5 before 5.89: the third argument, `context`, is what onMutate returned):**

```typescript
const queryClient = useQueryClient();
useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ['todos', newTodo.id] });
    const previousTodo = queryClient.getQueryData(['todos', newTodo.id]);
    queryClient.setQueryData(['todos', newTodo.id], newTodo);
    return { previousTodo };
  },
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(['todos', newTodo.id], context?.previousTodo);
  },
  onSettled: (data, error, newTodo) =>
    queryClient.invalidateQueries({ queryKey: ['todos', newTodo.id] }),
});
```

- In 5.89 the argument that holds onMutate's return value was renamed `onMutateResult`. The final argument `context` is now `{ client, meta, mutationKey }`. The arguments are positional, so v4-style code still runs. Rename the parameters anyway, so that `context` means the same thing everywhere.
- Using `queryClient` from `useQueryClient()` is still valid in v5. `context.client` matters when the options are defined outside a component (`mutationOptions`, `setMutationDefaults`).
- In most failure cases, refetching alone reverts the optimistic state. Rollback covers the cases where that refetch cannot succeed.
- Keep `onMutate` before `onError` and `onSettled` so TypeScript infers the type of `onMutateResult` (ESLint `@tanstack/query/mutation-property-order`, since 5.78).

Reference: [Optimistic Updates](https://tanstack.com/query/v5/docs/framework/react/guides/optimistic-updates) · [v4 Optimistic Updates](https://tanstack.com/query/v4/docs/framework/react/guides/optimistic-updates)
