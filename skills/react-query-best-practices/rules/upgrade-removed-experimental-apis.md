---
title: Replace Experimental APIs Removed in v5 Minors
impact: MEDIUM
impactDescription: type errors and runtime failures after upgrading to 5.86 / 5.102
tags: upgrade, v5, experimental, prefetchInRender, promise, streamedQuery, suspense
versions: v5
since: "5.102"
---

## Replace Experimental APIs Removed in v5 Minors

Several experimental APIs were removed or reshaped inside v5. They show up as type errors, or at runtime as `undefined` values. Move to the stable equivalents before (or while) upgrading.

**5.102: `experimental_prefetchInRender` and the `promise` result property are gone:**

```typescript
// before (5.59–5.101)
new QueryClient({ defaultOptions: { queries: { experimental_prefetchInRender: true } } });
const { promise } = useQuery(todoOptions(id));
const todo = React.use(promise); // ≥5.102: promise is undefined

// after: Suspense hooks, plus usePrefetchQuery to start the fetch higher up
function Layout({ id }: { id: number }) {
  usePrefetchQuery(todoOptions(id));
  return <Suspense fallback={<Spinner />}><Todo id={id} /></Suspense>;
}
function Todo({ id }: { id: number }) {
  const { data: todo } = useSuspenseQuery(todoOptions(id)); // data is never undefined
}
```

**5.102: `placeholderData` removed from `useSuspenseInfiniteQuery` options:**

```typescript
useSuspenseInfiniteQuery({ ...projectsOptions, placeholderData: keepPreviousData }); // before
useSuspenseInfiniteQuery(projectsOptions);                                         // after
```

Suspense hooks do not accept `enabled`, `placeholderData` or `skipToken`. To keep the old UI while the key changes, wrap the update that changes the key in `startTransition`.

**5.102: `experimental_beforeQuery` / `experimental_afterQuery` client options removed.** Delete them from the `QueryClient` config. There is no replacement.

**5.86: `experimental_streamedQuery` options renamed and reshaped:**

```typescript
import { experimental_streamedQuery as streamedQuery } from '@tanstack/react-query';

// before (5.69–5.85)
queryFn: streamedQuery({ queryFn: fetchChunks, maxChunks: 3 });

// after: queryFn → streamFn; maxChunks removed in favour of a reducer
queryFn: streamedQuery({
  streamFn: fetchChunks,
  reducer: (acc, chunk) => [...acc, chunk].slice(-3), // (acc: TData, chunk) => TData
  initialValue: [] as Chunk[], // required whenever a custom reducer is passed
});
```

Reference: [Suspense](https://tanstack.com/query/v5/docs/framework/react/guides/suspense) · [Prefetching](https://tanstack.com/query/v5/docs/framework/react/guides/prefetching) · [streamedQuery](https://tanstack.com/query/v5/docs/framework/react/reference/functions/experimental_streamedQuery)
