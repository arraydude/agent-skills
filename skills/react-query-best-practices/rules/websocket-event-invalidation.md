---
title: Event-Based Invalidation
impact: HIGH
impactDescription: simple, predictable real-time sync
tags: websocket, invalidation, realtime
versions: v4, v5
---

## Event-Based Invalidation

Have the backend push small events that name what changed, not full data objects. The client then calls `invalidateQueries` for that key. Queries on screen refetch in the background, and the rest are marked stale for their next mount. This follows the docs' approach of targeted invalidation plus background refetching, and avoids maintaining a normalized client cache.

**Incorrect (pushing full payloads and merging them by hand):**

```typescript
socket.on('todo', (todo) => {
  // every list, filter and page variant now needs custom merge logic
  queryClient.setQueryData(['todos', 'list'], (old) => [...old, todo]);
});
```

**Correct (events carry query keys):**

```typescript
// Backend sends: { "entity": ["automations", "list"] }
//                { "entity": ["automations", "detail", "abc123"] }
function useWebSocketSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = connectWebSocket();
    socket.on('invalidate', (event) => {
      queryClient.invalidateQueries({ queryKey: event.entity });
    });
    return () => socket.disconnect();
  }, [queryClient]);
}
```

**Correct (patch high-frequency fields, invalidate the rest):**

```typescript
switch (message.type) {
  case 'AUTOMATION_STATUS_CHANGED':
    // frequent and small: patch it, and leave the cache alone when nothing is cached
    queryClient.setQueryData(['automations', 'detail', message.id], (old) =>
      old ? { ...old, status: message.status } : old,
    );
    break;
  case 'AUTOMATION_UPDATED':
    queryClient.invalidateQueries({ queryKey: ['automations'] });
    break;
}
```

- Prefix matching means `['automations']` also invalidates lists and details. Use `exact: true` to target a single key.
- Pair this rule with `websocket-stale-time-infinity` and `websocket-reconnection`.

Reference: [Query Invalidation](https://tanstack.com/query/v5/docs/framework/react/guides/query-invalidation) · [v4 Query Invalidation](https://tanstack.com/query/v4/docs/framework/react/guides/query-invalidation)
