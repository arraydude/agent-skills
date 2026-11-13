---
title: staleTime Infinity (Not 'static') for WebSocket-Driven Data
impact: HIGH
impactDescription: no redundant refetches, while socket invalidations still work
tags: websocket, staleTime, static, configuration
versions: v4, v5
---

## staleTime Infinity (Not 'static') for WebSocket-Driven Data

When a socket tells you what changed, set `staleTime: Infinity`. The data then stays fresh until an event invalidates it, so mounting, window focus and network reconnect no longer trigger refetches. Do not use v5's `staleTime: 'static'` here: `invalidateQueries` has no effect on static queries, so socket events would do nothing.

**Incorrect (v5: 'static' ignores invalidation):**

```typescript
useQuery({
  queryKey: ['automations', 'detail', id],
  queryFn: () => fetchAutomation(id),
  staleTime: 'static', // invalidateQueries() from the socket is ignored
});
```

**Correct (Infinity: fresh until invalidated):**

```typescript
useQuery({
  queryKey: ['automations', 'detail', id],
  queryFn: () => fetchAutomation(id),
  staleTime: Infinity,
});
```

**Correct (app-wide, when the socket covers everything):**

```typescript
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
});
```

- `refetchOnWindowFocus: false` is unnecessary with `Infinity`, because focus refetches only run for stale data.
- `'static'` (added in 5.79) is for data that cannot change while the app runs, such as feature flags or permissions loaded at login. It also blocks `refetchOn*: 'always'`.
- With `Infinity`, the automatic refetch on reconnect is skipped too, so handle socket reconnects yourself (see `websocket-reconnection`).

Reference: [Important Defaults](https://tanstack.com/query/v5/docs/framework/react/guides/important-defaults) · [Window Focus Refetching](https://tanstack.com/query/v5/docs/framework/react/guides/window-focus-refetching) · [v4 Important Defaults](https://tanstack.com/query/v4/docs/framework/react/guides/important-defaults)
