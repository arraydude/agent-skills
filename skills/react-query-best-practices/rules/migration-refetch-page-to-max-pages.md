---
title: refetchPage Replaced by maxPages
impact: MEDIUM
impactDescription: breaking change for infinite queries
tags: migration, v5, infinite, refetchPage, maxPages
versions: v4, v5
---

## refetchPage Replaced by maxPages

v5 removed `refetchPage`, which in v4 chose which pages of an infinite query to refetch. It was never a `useInfiniteQuery` option: it lived on the result's `refetch()` and on the `refetchQueries` / `invalidateQueries` / `resetQueries` filters, where it did nothing for normal queries. Refetching only some pages could leave the UI inconsistent. Use `maxPages` instead: it limits how many pages are stored, and therefore how many are refetched.

**v4 (before):**

```typescript
const { refetch } = useInfiniteQuery({
  queryKey: ['projects'],
  queryFn: ({ pageParam = 0 }) => fetchProjectsPage(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
refetch({ refetchPage: (_page, index) => index < 2 });

queryClient.refetchQueries({
  queryKey: ['projects'],
  refetchPage: (_page, index) => index === 0,
});
```

**v5 (after):**

```typescript
useInfiniteQuery({
  queryKey: ['projects'],
  queryFn: ({ pageParam }) => fetchProjectsPage(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
  getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  maxPages: 3,
});
```

- `maxPages` requires a bi-directional list: define **both** `getNextPageParam` and `getPreviousPageParam`. Pages dropped from one end can then be fetched again when the user scrolls back.
- On refetch, only the stored pages (at most `maxPages`) are refetched, one after another.

Reference: [Migrating to v5](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5#removed-refetchpage-in-favor-of-maxpages), [Infinite Queries](https://tanstack.com/query/v5/docs/framework/react/guides/infinite-queries#what-if-i-want-to-limit-the-number-of-pages), [v4 Infinite Queries](https://tanstack.com/query/v4/docs/framework/react/guides/infinite-queries)
