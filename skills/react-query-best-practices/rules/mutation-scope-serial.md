---
title: Serialize Dependent Mutations With scope
impact: MEDIUM
impactDescription: prevents out-of-order writes from rapid repeated mutations
tags: mutation, scope, serial, concurrency, isPaused
versions: v5
since: "5.31"
---

## Serialize Dependent Mutations With scope

By default, every `mutate()` call runs immediately and in parallel, even repeated calls of the same mutation. Requests can then finish in a different order than they were sent. When order matters, for example repeated saves of the same document, give the mutations a shared `scope.id`. Mutations with the same id run one after another; later ones wait with `isPaused: true` until their turn.

**Incorrect (parallel saves can finish out of order):**

```typescript
const save = useMutation({ mutationFn: saveDraft });
// typing fast: save #2 may resolve before save #1 and get overwritten by it
save.mutate(draftV1);
save.mutate(draftV2);
```

**Correct (one queue per document):**

```typescript
const save = useMutation({
  mutationFn: saveDraft,
  scope: { id: `draft-${draftId}` },
});

save.mutate(draftV1);
save.mutate(draftV2); // onMutate runs now; mutationFn waits paused until draftV1 settles
```

- `isPaused` is `true` while a mutation waits in its scope queue, and also while it waits for the network to come back. Account for both before showing "offline" UI.
- Mutations without a `scope` keep running in parallel. Only mutations that share the exact `scope.id` are queued together.
- 5.104.2 fixed a bug where queued scoped mutations did not start while the window was unfocused.
- v4 has no `scope`. Migrate first (`migration-single-signature`).

Reference: [Mutations: Mutation Scopes](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-scopes) · [useMutation](https://tanstack.com/query/v5/docs/framework/react/reference/functions/useMutation)
