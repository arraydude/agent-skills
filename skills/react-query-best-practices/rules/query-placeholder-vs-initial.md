---
title: Placeholder vs Initial Data
impact: MEDIUM
impactDescription: wrong choice persists partial data to the cache or causes needless loading states
tags: query, placeholder, initial, cache, pagination, keepPreviousData
versions: v4, v5
---

## Placeholder vs Initial Data

Use `initialData` only for complete data you trust: it is persisted to the cache and treated as freshly fetched. Use `placeholderData` for partial or fake data: it is shown while the real data loads and never written to the cache.

| Aspect | initialData | placeholderData |
|--------|-------------|-----------------|
| Written to cache | Yes | No |
| Freshness | Treated as fetched now (or at `initialDataUpdatedAt`), so `staleTime` applies | Only shown while the cache is empty; never counts as cached data, so it never prevents the fetch |
| Result flag | none | `isPlaceholderData: true` |

**Incorrect (partial preview data persisted as if complete):**

```typescript
useQuery({
  queryKey: ['blogPost', id],
  queryFn: () => fetchPost(id),
  // list items only have title + snippet, but this is now "the" cached post
  initialData: () => queryClient.getQueryData<Post[]>(['blogPosts'])?.find((p) => p.id === id),
});
```

**Correct (partial data as placeholder, complete data as initial with its real timestamp):**

```typescript
useQuery({
  queryKey: ['blogPost', id],
  queryFn: () => fetchPost(id),
  placeholderData: () => queryClient.getQueryData<Post[]>(['blogPosts'])?.find((p) => p.id === id),
});

useQuery({
  queryKey: ['todo', todoId],
  queryFn: () => fetchTodo(todoId),
  initialData: () => queryClient.getQueryData<Todo[]>(['todos'])?.find((t) => t.id === todoId),
  initialDataUpdatedAt: () => queryClient.getQueryState(['todos'])?.dataUpdatedAt,
});
```

**Correct (v5): keep the previous page visible while the next one loads**

```typescript
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const { data, isPlaceholderData } = useQuery({
  queryKey: ['projects', page],
  queryFn: () => fetchProjects(page),
  placeholderData: keepPreviousData, // or (previousData) => previousData
});
// disable "Next" while isPlaceholderData is true
```

**Correct (v4):**

```typescript
const { data, isPreviousData } = useQuery({
  queryKey: ['projects', page],
  queryFn: () => fetchProjects(page),
  keepPreviousData: true,
});
```

- A query with placeholder data reports `status: 'success'`. In v5.65+, `isPlaceholderData: true` also narrows the result type.
- v5 suspense hooks have no `placeholderData`: wrap key changes in `startTransition` instead.
- Infinite queries: `initialData` and `placeholderData` must have the `{ pages, pageParams }` shape.

Reference: [Placeholder Query Data](https://tanstack.com/query/v5/docs/framework/react/guides/placeholder-query-data), [Initial Query Data](https://tanstack.com/query/v5/docs/framework/react/guides/initial-query-data), [Paginated Queries](https://tanstack.com/query/v5/docs/framework/react/guides/paginated-queries), [v4 Paginated Queries](https://tanstack.com/query/v4/docs/framework/react/guides/paginated-queries)
