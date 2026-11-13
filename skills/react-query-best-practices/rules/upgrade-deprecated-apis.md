---
title: Move Off APIs Deprecated or Narrowed in v5 Minors
impact: MEDIUM
impactDescription: deprecated APIs are removed in the next major; narrowed filter types already fail to compile
tags: upgrade, v5, deprecated, environmentManager, isServer, persister, CancelledError, filters
versions: v5
since: "5.91"
---

## Move Off APIs Deprecated or Narrowed in v5 Minors

These APIs still work in current v5 but are marked deprecated and are slated for removal in the next major. The filter fields at the end were removed from the types in 5.105, so they already fail to compile. For `fetchQuery`/`prefetchQuery`/`ensureQueryData` (deprecated in 5.102), see `query-imperative-query-method`.

**`isServer` → `environmentManager.isServer()` (5.91):**

```typescript
import { isServer } from '@tanstack/react-query';             // before
if (isServer) return makeQueryClient();

import { environmentManager } from '@tanstack/react-query';   // after
if (environmentManager.isServer()) return makeQueryClient();
```

**`createSyncStoragePersister` → `createAsyncStoragePersister` (deprecated in 5.81.4):**

```typescript
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'; // before
const persister = createSyncStoragePersister({ storage: window.localStorage });

import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'; // after
const persister = createAsyncStoragePersister({ storage: window.localStorage }); // sync storages fit the AsyncStorage interface
```

**`isCancelledError(err)` → `err instanceof CancelledError`:**

```typescript
import { CancelledError } from '@tanstack/react-query';
if (err instanceof CancelledError) return; // replaces isCancelledError(err)
```

**`direction` in the infinite `QueryFunctionContext` (deprecated in 5.35.4):** put the direction inside the page param.

```typescript
type FeedParam = { cursor: number; direction: 'forward' | 'backward' };

useInfiniteQuery({
  queryKey: ['feed'],
  queryFn: ({ pageParam }) => fetchFeed(pageParam.cursor, pageParam.direction), // not ctx.direction
  initialPageParam: { cursor: 0, direction: 'forward' } as FeedParam,
  getPreviousPageParam: (first) => first.prev == null ? undefined : { cursor: first.prev, direction: 'backward' },
  getNextPageParam: (last) => last.next == null ? undefined : { cursor: last.next, direction: 'forward' },
});
```

**Filter fields removed from counting APIs (5.105.1 / 5.105.2):**

```typescript
useIsFetching({ queryKey: ['todos'], fetchStatus: 'fetching' }); // before: type error now
useIsFetching({ queryKey: ['todos'] });                          // after: it only ever counts fetching queries
useIsMutating({ mutationKey: ['addTodo'] });                     // same for status on isMutating/useIsMutating
```

- `isInitialLoading` is deprecated in favour of `isLoading` (see `migration-status-pending`).

Reference: [Advanced SSR](https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr) · [createAsyncStoragePersister](https://tanstack.com/query/v5/docs/framework/react/plugins/createAsyncStoragePersister) · [Query Functions](https://tanstack.com/query/v5/docs/framework/react/guides/query-functions)
