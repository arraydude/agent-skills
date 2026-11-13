---
title: Set a Default staleTime Above Zero for SSR
impact: HIGH
impactDescription: avoids refetching every server-rendered query as soon as the page loads
tags: ssr, staleTime, hydration, prefetching
versions: v4, v5
---

## Set a Default staleTime Above Zero for SSR

Staleness is measured from when the query was fetched on the server. With the default `staleTime: 0`, every hydrated query is already stale on the client and refetches in the background on page load, so the data is fetched twice. Set a default `staleTime` above zero on the client used for SSR.

**Incorrect (hydrated data refetches immediately on the client):**

```typescript
const [queryClient] = React.useState(() => new QueryClient());
```

**Correct:**

```typescript
const [queryClient] = React.useState(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          // With SSR, set a default staleTime above 0
          // to avoid refetching immediately on the client
          staleTime: 60 * 1000,
        },
      },
    }),
);
```

- Prefetches use the client's default `staleTime` too. Setting it on the server client avoids passing a `staleTime` to every prefetch call.
- Stale data refetching on load pairs well with CDN-cached markup: cache the page for a long time and keep the query `staleTime` low, so data refreshes in the background when a user visits.
- The server's clock must be correct, because `dataUpdatedAt` comes from the server (in UTC).

Reference: [Server Rendering & Hydration](https://tanstack.com/query/v5/docs/framework/react/guides/ssr#staleness-is-measured-from-when-the-query-was-fetched-on-the-server), [v4 SSR](https://tanstack.com/query/v4/docs/framework/react/guides/ssr)
