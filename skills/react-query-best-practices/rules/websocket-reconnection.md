---
title: Invalidate Everything the Socket Owns on Reconnect
impact: MEDIUM
impactDescription: recovers events missed while disconnected
tags: websocket, reconnect, invalidation, polling
versions: v4, v5
---

## Invalidate Everything the Socket Owns on Reconnect

While the socket is down, events are lost and nothing gets marked invalidated. On reconnect, invalidate every key the socket manages, or the whole cache. Do not filter on `query.state.isInvalidated`: that flag resets on every successful fetch, and invalidated queries that are on screen have already refetched. That filter therefore matches mostly inactive queries (plus disabled ones and those whose last fetch failed), which the default `refetchType: 'active'` does not refetch, so the handler does almost nothing.

**Incorrect (matches almost nothing):**

```typescript
socket.on('connect', () => {
  queryClient.invalidateQueries({
    predicate: (query) => query.state.isInvalidated, // missed events never set this
  });
});
```

**Correct (invalidate what the socket owns):**

```typescript
function useWebSocketWithReconnect() {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = connectWebSocket();
    socket.on('connect', () => {
      setIsConnected(true);
      // on-screen queries refetch now; the rest refetch when they next mount
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      // or, if the socket drives the whole cache: queryClient.invalidateQueries()
    });
    socket.on('disconnect', () => setIsConnected(false));
    return () => socket.disconnect();
  }, [queryClient]);

  return isConnected;
}
```

**Fallback to polling while disconnected:**

```typescript
const { data } = useQuery({
  queryKey: ['automations', 'detail', id],
  queryFn: () => fetchAutomation(id),
  staleTime: isConnected ? Infinity : 0,
  refetchInterval: isConnected ? false : 5000,
});
```

- With `staleTime: Infinity`, the built-in `refetchOnReconnect` never fires for this data, because it only refetches stale queries. That is why the socket's own `connect` event has to trigger the invalidation.

Reference: [Query Invalidation](https://tanstack.com/query/v5/docs/framework/react/guides/query-invalidation) · [Network Mode](https://tanstack.com/query/v5/docs/framework/react/guides/network-mode) · [v4 Query Invalidation](https://tanstack.com/query/v4/docs/framework/react/guides/query-invalidation)
