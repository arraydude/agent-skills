---
title: Query Callbacks Removed from useQuery
impact: HIGH
impactDescription: breaking change, callbacks are type errors and never fire in JS
tags: migration, v5, onSuccess, onError, onSettled, callbacks, QueryCache
versions: v4, v5
---

## Query Callbacks Removed from useQuery

v5 removed `onSuccess`, `onError` and `onSettled` from `useQuery` and `QueryObserver`. They remain on mutations. Global reactions such as error toasts move to the `QueryCache` callbacks. Per-component effects move to the component, driven by the query result.

**v4 (before):**

```typescript
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  onSuccess: (data) => analytics.track('user_loaded', { id: data.id }),
  onError: (error) => toast.error((error as Error).message), // v4 types error as unknown
});
```

**v5 (after): global error handling on the cache:**

```typescript
import { QueryCache, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => toast.error(error.message),
  }),
});
```

**v5 (after): component-level side effects from the result:**

```typescript
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

useEffect(() => {
  if (data) analytics.track('user_loaded', { id: data.id });
}, [data]);
```

- To change data, use `select`, not a callback that writes into state (see `troubleshoot-copy-to-state`).
- `useMutation` keeps `onSuccess`/`onError`/`onSettled`; see `mutation-callback-separation`.
- There is no codemod for this change. The motivation is laid out in the RFC linked from the migration guide.

Reference: [Migrating to v5](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5#callbacks-on-usequery-and-queryobserver-have-been-removed) · [QueryCache](https://tanstack.com/query/v5/docs/framework/react/reference/classes/QueryCache)
