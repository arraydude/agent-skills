---
title: Prefetch, Dehydrate and Hydrate Instead of initialData
impact: HIGH
impactDescription: server data reaches every useQuery for that key and refreshes on later navigations
tags: ssr, hydration, dehydrate, HydrationBoundary, prefetching, nextjs, remix
versions: v4, v5
---

## Prefetch, Dehydrate and Hydrate Instead of initialData

To server render, prefetch into a fresh `QueryClient` in the loader, return `dehydrate(queryClient)`, and wrap the tree in a hydration boundary. Passing loader data as `initialData` has drawbacks. You must pass it down to every `useQuery` that needs it. `dataUpdatedAt` reflects page load, not the server fetch. And `initialData` never overwrites existing cache data, even when the new data is fresher.

**Incorrect (loader data as initialData):**

```typescript
export async function getServerSideProps() {
  return { props: { posts: await getPosts() } };
}
function Posts({ posts }) {
  const { data } = useQuery({ queryKey: ['posts'], queryFn: getPosts, initialData: posts });
}
```

**Correct (v5.102+):**

```typescript
import { dehydrate, HydrationBoundary, noop, QueryClient } from '@tanstack/react-query';

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.query({ queryKey: ['posts'], queryFn: getPosts }).catch(noop),
    queryClient.query({ queryKey: ['tags'], queryFn: getTags }).catch(noop),
  ]);
  return { props: { dehydratedState: dehydrate(queryClient) } };
}

export default function PostsRoute({ dehydratedState }) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <Posts />
    </HydrationBoundary>
  );
}
```

In v5 before 5.102, use `await queryClient.prefetchQuery({ queryKey, queryFn })`. It never throws, so it needs no `.catch`. In 5.102 `prefetchQuery` was deprecated in favour of `query`.

**Correct (v4):**

```typescript
import { dehydrate, Hydrate, QueryClient } from '@tanstack/react-query';

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['posts'], getPosts);
  return { props: { dehydratedState: dehydrate(queryClient) } };
}
// <Hydrate state={dehydratedState}><Posts /></Hydrate>
```

- `dehydrate` includes only successful queries by default, so failed prefetches are retried on the client. For critical data, `await queryClient.query(...)` without `.catch` and handle the error yourself (for example with a 404 or 500 response).
- Queries you don't prefetch are fetched on the client after hydration. Mixing both is fine.
- With a custom SSR setup, don't embed the state with raw `JSON.stringify`, which is an XSS risk. Use a serializer that escapes it, such as `devalue`.
- Server Components: treat them as a place to prefetch only. Don't render the result of `queryClient.query` on the server, because it goes out of sync when the client refetches.

Reference: [Server Rendering & Hydration](https://tanstack.com/query/v5/docs/framework/react/guides/ssr#using-the-hydration-apis), [Advanced Server Rendering](https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr), [v4 SSR](https://tanstack.com/query/v4/docs/framework/react/guides/ssr)
