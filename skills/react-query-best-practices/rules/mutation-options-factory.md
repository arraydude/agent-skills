---
title: Share Mutation Definitions With mutationOptions
impact: MEDIUM
impactDescription: one typed definition reused by hooks, defaults and mutation-state filters
tags: mutation, mutationOptions, mutationKey, typescript
versions: v5
since: "5.89"
---

## Share Mutation Definitions With mutationOptions

Define each mutation once with `mutationOptions` and pass the result to `useMutation`. It returns the same object, fully typed. If you include a `mutationKey`, that overload requires it, so `useMutationState` filters can reuse the exact key.

**Incorrect (key and options duplicated across files):**

```typescript
useMutation({ mutationKey: ['posts', 'create'], mutationFn: createPost });
// elsewhere: typo, so the filter silently never matches
useMutationState({ filters: { mutationKey: ['post', 'create'], status: 'pending' } });
```

**Correct:**

```typescript
import { mutationOptions, useMutation, useMutationState } from '@tanstack/react-query';

export const createPostOptions = mutationOptions({
  mutationKey: ['posts', 'create'],
  mutationFn: createPost,
  onSuccess: (data, variables, onMutateResult, context) =>
    context.client.invalidateQueries({ queryKey: ['posts'] }),
});

function CreatePost() {
  const mutation = useMutation(createPostOptions);
  return <button onClick={() => mutation.mutate({ title: 'Hello' })}>Create</button>;
}

function SavingIndicator() {
  const saving = useMutationState({
    filters: { mutationKey: createPostOptions.mutationKey, status: 'pending' },
  }).length > 0;
  return saving ? <span>Saving…</span> : null;
}
```

- The options live outside any component, so callbacks use `context.client` (5.89+) instead of `useQueryClient()`.
- The overload without `mutationKey` suits mutations you never need to look up by key.
- `mutationOptions` itself shipped in 5.82; the `context` argument used above needs 5.89.
- v4.44 has a backported `mutationOptions` without `context.client`, and v4 has no `useMutationState`: read the pending state with `useIsMutating({ mutationKey })`. Older v4: use a custom hook (see `mutation-callback-separation`).

Reference: [mutationOptions](https://tanstack.com/query/v5/docs/framework/react/reference/functions/mutationOptions) · [Mutations](https://tanstack.com/query/v5/docs/framework/react/guides/mutations)
