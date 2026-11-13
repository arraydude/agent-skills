---
title: Prefer mutate() Over mutateAsync()
impact: HIGH
impactDescription: no unhandled promise rejections from fire-and-forget calls
tags: mutation, mutate, mutateAsync, error
versions: v4, v5
---

## Prefer mutate() Over mutateAsync()

Call `mutate()` and handle the outcome with callbacks. `mutateAsync()` returns a promise that rejects when the mutation fails. Use it only when you need that promise: to compose steps that depend on each other, or to wait for several parallel calls. Always wrap it in `try/catch`.

**Incorrect (promise rejection that nothing handles):**

```typescript
const { mutateAsync } = useMutation({ mutationFn: updateTodo });

const handleSave = () => {
  mutateAsync(todo); // rejects on error and nothing catches it
};
```

**Correct (mutate with callbacks):**

```typescript
const { mutate } = useMutation({
  mutationFn: updateTodo,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
});

mutate(todo, {
  onSuccess: () => toast.success('Saved!'),
  onError: (error) => toast.error(error instanceof Error ? error.message : 'Save failed'), // v4 types error as unknown
});
```

**Correct (mutateAsync when one step needs the previous result):**

```typescript
async function handleCreate() {
  try {
    const user = await createUser.mutateAsync(userData);
    await createProfile.mutateAsync({ userId: user.id, ...profileData });
  } catch (error) {
    toast.error('Failed to create user');
  }
}
```

**Correct (mutateAsync for parallel calls):**

```typescript
// Callbacks passed per call to mutate() fire only for the LAST call,
// so use one promise per call and wait for all of them.
const results = await Promise.allSettled(
  todos.map((todo) => addTodo.mutateAsync(todo)),
);
```

- Callbacks passed per call to `mutate` run only once, for the latest call, and only if the component is still mounted. Callbacks passed to `useMutation` run for every call.
- v5: if the calls only need to run one after another rather than feed into each other, use a mutation `scope` instead (see `mutation-scope-serial`).

Reference: [Mutations](https://tanstack.com/query/v5/docs/framework/react/guides/mutations) · [useMutation](https://tanstack.com/query/v5/docs/framework/react/reference/functions/useMutation) · [v4 Mutations](https://tanstack.com/query/v4/docs/framework/react/guides/mutations)
