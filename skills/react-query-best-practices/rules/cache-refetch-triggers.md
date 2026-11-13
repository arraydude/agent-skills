---
title: Refetch Triggers
impact: HIGH
impactDescription: keeps data fresh without excess requests
tags: cache, refetch, windowFocus, reconnect, mount
versions: v4, v5
---

## Refetch Triggers

Leave `refetchOnMount`, `refetchOnWindowFocus` and `refetchOnReconnect` on. They refetch only stale queries, so `staleTime` is the setting that controls how often they fire. Disable a trigger only when something else keeps the data fresh.

**Incorrect (turning every trigger off to silence refetches):**

```typescript
useQuery({
  queryKey: ['user'],
  queryFn: fetchUser,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
}); // staleTime is still 0, but nothing ever refreshes the data
```

**Correct (tune staleTime, keep the triggers):**

```typescript
useQuery({ queryKey: ['user'], queryFn: fetchUser, staleTime: 5 * 60 * 1000 });

// Data pushed over a WebSocket: Infinity alone already stops staleness-based refetches.
// Invalidating marks it stale, after which the triggers apply again.
useQuery({ queryKey: ['automations', id], queryFn: () => fetchAutomation(id), staleTime: Infinity });
```

**Correct (`'always'` and callback forms):**

```typescript
useQuery({
  queryKey: ['inbox'],
  queryFn: fetchInbox,
  refetchOnWindowFocus: 'always',                                  // refetch even when fresh
  refetchOnMount: (query) => query.state.status === 'error',       // callback receives the query
});
```

- In v5 these callbacks receive only `query`. If you need data, read `query.state.data`, which has not been through `select` (see `migration-refetch-interval-callback`).
- `staleTime: 'static'` (v5.79+) blocks even the `'always'` settings.
- `refetchOnReconnect` defaults to `false` under `networkMode: 'always'`.
- v5 detects focus only through `visibilitychange`, not the `focus` event. If refocusing doesn't refetch in development, turn off Chrome DevTools > Rendering > "Emulate a focused page".
- Use `focusManager.setEventListener` / `focusManager.setFocused` for custom focus sources (e.g. React Native `AppState`).

Reference: [Window Focus Refetching](https://tanstack.com/query/v5/docs/framework/react/guides/window-focus-refetching) · [Important Defaults](https://tanstack.com/query/v5/docs/framework/react/guides/important-defaults) · [v4 Window Focus Refetching](https://tanstack.com/query/v4/docs/framework/react/guides/window-focus-refetching)
