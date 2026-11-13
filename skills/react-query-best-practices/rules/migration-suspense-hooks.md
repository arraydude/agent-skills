---
title: New Dedicated Suspense Hooks
impact: HIGH
impactDescription: the suspense option is gone in v5; queries stop suspending
tags: migration, v5, suspense, useSuspenseQuery
versions: v4, v5
---

## New Dedicated Suspense Hooks

v5 removed the experimental `suspense: boolean` flag. Suspense now uses dedicated hooks, and `data` is typed as always defined because loading and error states are handled by `<Suspense>` and error boundaries.

**v4 (before):**

```typescript
const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  suspense: true,
});
// data: TData | undefined
```

**v5 (after):**

```typescript
import { useSuspenseQuery } from '@tanstack/react-query';

const { data } = useSuspenseQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
});
// data: TData
```

**Available hooks:** `useSuspenseQuery`, `useSuspenseInfiniteQuery`, `useSuspenseQueries`.

**What changes when you switch:**
- `enabled`, `placeholderData` and `throwOnError` are not accepted, and `queryFn` cannot be `skipToken`. You cannot conditionally disable a suspense query.
- `status` is only `success` or `error`, and `isPlaceholderData` is not on the result.
- Instead of `placeholderData`, wrap updates that change the query key in `startTransition` so the fallback does not replace the UI. `useSuspenseInfiniteQuery` also lost `placeholderData` from its types in 5.102.
- Errors are thrown to the error boundary only when there is no cached data; a failed background refetch keeps rendering the cached data. Throw `error` yourself if every error must reach the boundary.
- Several `useSuspenseQuery` calls in one component fetch one after another; use `useSuspenseQueries` for parallel fetching (see `suspense-parallel-queries`).
- The `experimental_prefetchInRender` option and the `promise` result property for `React.use()` (added in 5.59) were removed in 5.102. Use these hooks instead.

Reference: [Suspense](https://tanstack.com/query/v5/docs/framework/react/guides/suspense), [Migrating to v5](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5#new-hooks-for-suspense), [v4 Suspense](https://tanstack.com/query/v4/docs/framework/react/guides/suspense)
