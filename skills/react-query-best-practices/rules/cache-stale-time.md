---
title: Setting staleTime
impact: HIGH
impactDescription: the recommended way to avoid excessive refetches
tags: cache, staleTime, gcTime, configuration
versions: v4, v5
---

## Setting staleTime

By default `staleTime` is `0`: cached data is stale immediately, so it refetches whenever a new instance mounts, the window regains focus, or the network reconnects. Set `staleTime` to how long the data stays acceptable. The docs call this the recommended way to cut refetches, rather than turning the triggers off.

**Incorrect (default `0` for data that rarely changes, then turning off triggers to compensate):**

```typescript
useQuery({ queryKey: ['config'], queryFn: fetchConfig, refetchOnWindowFocus: false, refetchOnMount: false });
```

**Correct (a global baseline plus per-query overrides):**

```typescript
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 2 * 60 * 1000 } }, // read from cache for 2 min
});

useQuery({ queryKey: ['notifications'], queryFn: fetchNotifications, staleTime: 30 * 1000 });
useQuery({ queryKey: ['config'], queryFn: fetchConfig, staleTime: 30 * 60 * 1000 });
useQuery({ queryKey: ['automations', id], queryFn: () => fetchAutomation(id), staleTime: Infinity }); // invalidated by WebSocket events
```

**Correct (v5.44+, staleTime computed per query):**

```typescript
useQuery({
  queryKey: ['job', id],
  queryFn: () => fetchJob(id),
  staleTime: (query) => (query.state.data?.status === 'done' ? Infinity : 5 * 1000),
});
```

- `Infinity` means the data is never stale until you invalidate it. v5.79+ adds `'static'`, which also ignores `invalidateQueries` (see `cache-static-vs-infinity`). v4 accepts only a number.
- Garbage collection is a separate setting. Inactive queries are removed after 5 minutes by default: `gcTime` in v5, `cacheTime` in v4 (see `migration-cache-time-to-gc-time`). Don't restate defaults (`gcTime` 5 min on the client, `retry` 3 on the client and 0 on the server in v5) in your config.
- `refetchInterval` polls regardless of `staleTime`.

Reference: [Important Defaults](https://tanstack.com/query/v5/docs/framework/react/guides/important-defaults) · [Caching](https://tanstack.com/query/v5/docs/framework/react/guides/caching) · [v4 Important Defaults](https://tanstack.com/query/v4/docs/framework/react/guides/important-defaults)
