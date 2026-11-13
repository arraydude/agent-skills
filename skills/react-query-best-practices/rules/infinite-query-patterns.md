---
title: Fetch Infinite Query Pages Safely
impact: HIGH
impactDescription: a page fetch silently cancels the fetch already running on the single shared cache entry
tags: infinite, useInfiniteQuery, fetchNextPage, pagination, maxPages
versions: v4, v5
---

## Fetch Infinite Query Pages Safely

All pages of an infinite query share one cache entry, and only one fetch can run at a time. Calling `fetchNextPage` while a fetch is in progress cancels that fetch, a background refresh included. Guard automatic triggers such as scroll handlers with `hasNextPage && !isFetching`, and derive page params from `getNextPageParam`.

**Incorrect (fires on every scroll event, even mid-refetch):**

```typescript
<List onEndReached={() => fetchNextPage()} />
```

**Correct (v5):**

```typescript
const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['projects'],
  queryFn: ({ pageParam }) => fetchProjects(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextCursor, // undefined or null = no more pages
});

<List onEndReached={() => hasNextPage && !isFetching && fetchNextPage()} />;
```

**Correct (v4):**

```typescript
const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['projects'],
  queryFn: ({ pageParam = 0 }) => fetchProjects(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor, // undefined, null or false = no more pages
});

<List onEndReached={() => hasNextPage && !isFetching && fetchNextPage()} />;
```

**Keep `pages` and `pageParams` aligned when editing the cache:**

```typescript
queryClient.setQueryData<InfiniteData<Page>>(['projects'], (data) => data && ({
  pages: data.pages.slice(1),
  pageParams: data.pageParams.slice(1),
}));
```

- Use `isFetchingNextPage` (not `isFetching`) for the "Loading more..." indicator. `isFetching` is also true during background refetches.
- On refetch, pages are refetched one after another starting from the first, so cursors are never stale. Many pages means many requests: in v5 limit them with `maxPages`. Add `getPreviousPageParam` too, so users can scroll back to the pages `maxPages` dropped.
- v5 ESLint `@tanstack/query/infinite-query-property-order` (recommended, auto-fixable) requires `queryFn` before `getPreviousPageParam` / `getNextPageParam`, for type inference.
- `fetchNextPage` defaults to `cancelRefetch: true`: it cancels an in-flight fetch and starts the page fetch. With `cancelRefetch: false`, calls made while a fetch runs are ignored and reuse that fetch.

Reference: [Infinite Queries](https://tanstack.com/query/v5/docs/framework/react/guides/infinite-queries), [v4 Infinite Queries](https://tanstack.com/query/v4/docs/framework/react/guides/infinite-queries)
