---
title: Use queryClient.query() for Imperative Fetching
impact: HIGH
impactDescription: replaces deprecated methods that are removed in v6
tags: query, queryClient, prefetch, fetchQuery, ensureQueryData, deprecation
versions: v5
since: "5.102"
---

## Use queryClient.query() for Imperative Fetching

Since 5.102 (#10658), `queryClient.query()` and `queryClient.infiniteQuery()` replace `fetchQuery`, `prefetchQuery`, `ensureQueryData` and their infinite variants. The old methods are deprecated and will be removed in v6. `query()` returns cached data when it is still fresh per `staleTime`, otherwise it fetches. It applies `select` either way and rejects on error.

**Incorrect (deprecated in 5.102+):**

```typescript
await queryClient.fetchQuery(todoOptions(id));
await queryClient.prefetchQuery(todoOptions(id));
const todo = await queryClient.ensureQueryData(todoOptions(id));
await queryClient.prefetchInfiniteQuery(feedOptions());
```

**Correct:**

```typescript
import { noop } from '@tanstack/react-query';

// fetchQuery → query
const todo = await queryClient.query(todoOptions(id));

// prefetchQuery → query + swallow the error
await queryClient.query(todoOptions(id)).catch(noop);

// ensureQueryData → query with staleTime: 'static' (any cached data is used as-is)
const cached = await queryClient.query({ ...todoOptions(id), staleTime: 'static' });

// fetchInfiniteQuery / prefetchInfiniteQuery / ensureInfiniteQueryData
await queryClient.infiniteQuery(feedOptions()).catch(noop);
await queryClient.infiniteQuery({ ...feedOptions(), staleTime: 'static' });
```

- `query()` defaults to `retry: false` unless you configure retries, because no component is there to retry through a re-render. Set `retry` explicitly for loaders that should retry.
- Observer-only options are not accepted: `enabled`, `refetchInterval`, `refetchIntervalInBackground`, `refetchOn*`, `retryOnMount`, `notifyOnChangeProps`, `throwOnError`, `suspense`, `placeholderData`.
- `usePrefetchQuery` / `usePrefetchInfiniteQuery` use the new methods internally since 5.102 (#10668).
- On v4 or v5 before 5.102, keep `fetchQuery` / `prefetchQuery` / `ensureQueryData`. In v4, call them with the object signature so the later rename is mechanical (`migration-single-signature`).

Reference: [Migrating to v5: Imperative QueryClient methods](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5) · [QueryClient.query](https://tanstack.com/query/v5/docs/framework/react/reference/classes/QueryClient)
