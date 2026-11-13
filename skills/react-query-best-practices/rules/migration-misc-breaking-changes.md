---
title: Misc v5 Breaking Changes
impact: MEDIUM
impactDescription: smaller breaking changes that are easy to miss during an upgrade
tags: migration, v5, misc, react18, typescript, logger, retry, hashKey, isDataEqual, setQueryDefaults
versions: v4, v5
---

## Misc v5 Breaking Changes

Check each of these when moving from v4 to v5. Most show up as type errors. The last group changes runtime behaviour without any compile-time signal.

**Platform floors:** React 18.0+ (v5 uses `useSyncExternalStore`; the peer range is now `^18 || ^19`). TypeScript 4.7+ at 5.0, with current docs supporting 5.7+ (see `upgrade-toolchain-floors`). Modern browsers only: Chrome/Edge 91, Firefox 90, Safari/iOS 15, Opera 77.

**Removed or renamed APIs (v4 before → v5 after):**

```typescript
// custom logger: removed; logging only happens in development
new QueryClient({ logger: myLogger });          // v4
new QueryClient();                              // v5

// hashQueryKey → hashKey (it hashes mutation keys too)
import { hashQueryKey } from '@tanstack/react-query'; // v4
import { hashKey } from '@tanstack/react-query';      // v5

// isDataEqual → structuralSharing
useQuery({ queryKey, queryFn, isDataEqual: eq });                  // v4
useQuery({ queryKey, queryFn,                                      // v5
  structuralSharing: (old, next) => (eq(old, next) ? old : replaceEqualDeep(old, next)) });

// manual pageParam override removed; getNextPageParam is now required
fetchNextPage({ pageParam: 5 });                // v4
fetchNextPage();                                // v5, page params come only from the getters
```

- `getNextPageParam` / `getPreviousPageParam` end the list with `undefined` or `null` only. A v4 getter that returned `false` (which v4's `hasNextPage` accepted) is no longer treated as the end (see `migration-initial-page-param`).
- ESLint: delete `@tanstack/query/prefer-query-object-syntax` from your config, because the rule no longer exists.
- See also `migration-error-type-default` (the `error` type is now `Error`) and `migration-dehydrate-options`.

**Behaviour changes (no type error):**

- **Query defaults merge.** `getQueryDefaults` now merges every matching `setQueryDefaults` registration instead of returning only the first match. Register from the most generic key to the most specific, and re-add overrides that a generic default now leaks into:

```typescript
queryClient.setQueryDefaults(['todo'], { retry: false, staleTime: 60_000 });
queryClient.setQueryDefaults(['todo', 'detail'], { retry: true, staleTime: 10_000 });
```

- **No retries on the server.** `retry` defaults to `0` on the server (it was 3). Set it per query if SSR should retry.
- **Window focus.** Only `visibilitychange` triggers focus refetching; the `focus` event is ignored.
- **Online status.** v5 no longer reads `navigator.onLine`. It starts `online: true` and follows `online`/`offline` events. Offline-first apps loaded from a service worker can see false "online" positives.
- **Private fields.** Internals are now real `#private` class fields. Code that reached into TS-private members gets `undefined`.
- **Batching.** `unstable_batchedUpdates` is no longer installed as the batch function, since it is a no-op in React 18. Use `notifyManager.setBatchNotifyFunction` only if your renderer needs one.

Reference: [Migrating to v5](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5) · [Installation requirements](https://tanstack.com/query/v5/docs/framework/react/installation#requirements)
