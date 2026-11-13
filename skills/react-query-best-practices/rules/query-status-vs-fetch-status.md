---
title: status vs fetchStatus
impact: MEDIUM
impactDescription: correct spinners for disabled, offline and background-refetching queries
tags: query, status, fetchStatus, isLoading, isFetching, offline
versions: v4, v5
---

## status vs fetchStatus

`status` describes the data: is there any? `fetchStatus` describes the `queryFn`: is it running (`fetching`), waiting for a network connection (`paused`), or doing nothing (`idle`)? All combinations occur. A query can have no data yet without fetching, for example when it is disabled or offline. A query with data can also be refetching in the background. Choose the flag that matches the UI you are drawing.

**Incorrect (v5: spinner from `isPending` alone):**

```typescript
const { isPending, data } = useQuery({ queryKey: ['todos', filter], queryFn: () => fetchTodos(filter), enabled: !!filter });
if (isPending) return <Spinner />; // spins forever while disabled, or while offline (paused)
```

**Correct (v5):**

```typescript
const { isLoading, isFetching, isPaused, data } = useQuery({
  queryKey: ['todos', filter],
  queryFn: () => fetchTodos(filter),
  enabled: !!filter,
});

if (isLoading) return <Spinner />;             // first fetch in flight (isPending && isFetching)
if (isPaused && !data) return <OfflineNotice />;
if (!data) return <EmptyFilterPrompt />;
return <List items={data} refreshing={isFetching} />; // background refetch indicator
```

**Correct (v4; `status: 'loading'` is v5's `pending`, `isInitialLoading` is v5's `isLoading`):**

```typescript
const { isInitialLoading, isFetching, data } = useQuery({
  queryKey: ['todos', filter],
  queryFn: () => fetchTodos(filter),
  enabled: !!filter,
});

if (isInitialLoading) return <Spinner />;
```

- `isRefetching` is `isFetching && !isPending` (v5), i.e. a background refetch.
- For an app-wide "something is loading" indicator, use `useIsFetching()`.
- With the default `networkMode: 'online'`, a query that mounts without a connection is `pending` + `paused`, not fetching. If online/offline events are unreliable (Electron, some WebViews), consider `networkMode: 'always'`.
- v5 deprecates `isInitialLoading` and will remove it in the next major (see `migration-status-pending`).

Reference: [Queries: FetchStatus](https://tanstack.com/query/v5/docs/framework/react/guides/queries) · [Network Mode](https://tanstack.com/query/v5/docs/framework/react/guides/network-mode) · [Background Fetching Indicators](https://tanstack.com/query/v5/docs/framework/react/guides/background-fetching-indicators) · [v4 Queries](https://tanstack.com/query/v4/docs/framework/react/guides/queries)
