---
title: initialPageParam Required for Infinite Queries
impact: HIGH
impactDescription: breaking change, every useInfiniteQuery needs an update
tags: migration, v5, infinite, initialPageParam, getNextPageParam
versions: v4, v5
---

## initialPageParam Required for Infinite Queries

In v5, every infinite query must declare `initialPageParam`; it is used as the `pageParam` of the first page. In v4 the first `pageParam` was `undefined`, which you defaulted in the `queryFn` signature. That stored `undefined` in the cache, and `undefined` is not serializable.

**v4 (before):**

```typescript
useInfiniteQuery({
  queryKey: ['projects'],
  queryFn: ({ pageParam = 0 }) => fetchProjects(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

**v5 (after):**

```typescript
useInfiniteQuery({
  queryKey: ['projects'],
  queryFn: ({ pageParam }) => fetchProjects(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

**Manual page params were removed in v5.** You can no longer override the next param by passing it to `fetchNextPage` / `fetchPreviousPage`, and `getNextPageParam` is now required. This feature never worked with refetches.

```typescript
// v4 (before): override the param by hand
fetchNextPage({ pageParam: cursorFromSomewhere });

// v5 (after): getNextPageParam is the only source of the next param
useInfiniteQuery({
  queryKey: ['projects'],
  queryFn: ({ pageParam }) => fetchProjects(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage, allPages, lastPageParam) =>
    lastPage.items.length === 0 ? undefined : lastPageParam + 1,
});
fetchNextPage();
```

**Ending the list:** return `undefined` or `null`. v4's `hasNextPage` also accepted `false`; v5 does not. A v4 getter that returns `false` now leaves `hasNextPage` true, and `fetchNextPage` calls the `queryFn` with `pageParam: false`.

Reference: [Migrating to v5](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5#infinite-queries-now-need-a-initialpageparam), [Infinite Queries](https://tanstack.com/query/v5/docs/framework/react/guides/infinite-queries), [v4 Infinite Queries](https://tanstack.com/query/v4/docs/framework/react/guides/infinite-queries)
