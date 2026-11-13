---
title: Flatten Request Waterfalls by Hoisting or Prefetching
impact: HIGH
impactDescription: each nested query that waits on its parent adds a full network round trip
tags: prefetch, waterfall, performance, usePrefetchQuery, suspense
versions: v4, v5
---

## Flatten Request Waterfalls by Hoisting or Prefetching

A child that only renders after its parent's query resolves cannot start its own query until then, so the requests run one after another. Start independent queries together: hoist the child's query into the parent, or prefetch it there.

**Incorrect (comments wait for the article):**

```typescript
function Article({ id }) {
  const article = useQuery({ queryKey: ['article', id], queryFn: getArticleById });
  if (!article.data) return 'Loading article...';
  return <Comments id={id} />; // its useQuery starts only now
}
```

**Correct (start the child's query in the parent and ignore the result):**

```typescript
function Article({ id }) {
  const article = useQuery({ queryKey: ['article', id], queryFn: getArticleById });
  // Prefetch; notifyOnChangeProps: [] avoids rerenders from this observer
  useQuery({
    queryKey: ['article-comments', id],
    queryFn: getArticleCommentsById,
    notifyOnChangeProps: [],
  });
  if (!article.data) return 'Loading article...';
  return <Comments id={id} />;
}
```

**Correct (with Suspense, v5.47+ or v4.43+): prefetch above the boundary**

```typescript
function ArticleLayout({ id }) {
  usePrefetchQuery({ queryKey: ['article-comments', id], queryFn: getArticleCommentsById });
  return (
    <Suspense fallback="Loading article">
      <Article id={id} /> {/* uses useSuspenseQuery */}
    </Suspense>
  );
}
```

A plain `useQuery` prefetch does not work with Suspense: it would start only after the suspending query resolves.

**Correct (v5.102+): dependent data you can't hoist, prefetched from the parent's queryFn**

```typescript
queryFn: async (...args) => {
  const feed = await getFeed(...args);
  for (const item of feed) {
    if (item.type === 'GRAPH') {
      void queryClient.query({ queryKey: ['graph', item.id], queryFn: getGraphDataById }).catch(noop);
    }
  }
  return feed;
},
```

**Correct (v4 and v5 before 5.102):** the same code with `void queryClient.prefetchQuery({ queryKey: ['graph', item.id], queryFn: getGraphDataById })`. `prefetchQuery` never throws.

- A truly dependent query (one that needs the parent's result) can't be flattened by prefetching. Return both from one API endpoint, or move the waterfall to the server.
- Code splitting adds waterfalls (load JS, then fetch). Prefetching in the parent loads the code and the data in parallel.
- Router loaders are the most systematic option. Prefetch non-critical data without `await`, and `await` critical data so errors reach the route's error boundary.
- Check the Network tab from time to time. Waterfalls creep in when queries are added to parents or children.

Reference: [Performance & Request Waterfalls](https://tanstack.com/query/v5/docs/framework/react/guides/request-waterfalls), [Prefetching & Router Integration](https://tanstack.com/query/v5/docs/framework/react/guides/prefetching), [v4 Prefetching](https://tanstack.com/query/v4/docs/framework/react/guides/prefetching)
