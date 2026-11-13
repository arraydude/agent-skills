---
title: Cache Logic in the Hook, UI Effects at the Call Site
impact: MEDIUM
impactDescription: cache stays consistent even if the component unmounts
tags: mutation, callbacks, hook, component
versions: v4, v5
---

## Cache Logic in the Hook, UI Effects at the Call Site

Put cache work (invalidation, `setQueryData`) in the callbacks passed to `useMutation`, which fire for every mutation. Put UI effects (toasts, navigation, closing a modal) in the callbacks passed to `mutate()`. Those fire only for the latest call, and only while the component is still mounted.

**Incorrect (cache update tied to the component):**

```typescript
function TodoEditor() {
  const { mutate } = useMutation({ mutationFn: updateTodo });
  mutate(todo, {
    // skipped if the user navigates away before the request settles
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });
}
```

**Correct (custom hook owns the cache logic):**

```typescript
export function useUpdateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTodo,
    onSuccess: (data) => {
      queryClient.setQueryData(['todos', 'detail', data.id], data);
      return queryClient.invalidateQueries({ queryKey: ['todos', 'list'] });
    },
  });
}
```

**Correct (component owns the UI effects):**

```typescript
function TodoEditor() {
  const { mutate } = useUpdateTodo();
  const handleSave = () =>
    mutate(todo, {
      onSuccess: () => {
        toast.success('Saved!');
        closeModal();
      },
      onError: () => toast.error('Save failed'),
    });
}
```

- Callbacks passed to `useMutation` run first, then the ones passed to `mutate`.
- When `mutate` runs several times in a row, its per-call callbacks fire only once, for the last call. Use `mutateAsync` if you need a result for each call (see `mutation-prefer-mutate`).
- v5: to share the hook's options without a wrapper hook, see `mutation-options-factory`.

Reference: [Mutations: Mutation Side Effects](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects) · [v4 Mutations](https://tanstack.com/query/v4/docs/framework/react/guides/mutations)
