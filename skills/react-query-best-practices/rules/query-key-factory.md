---
title: Query Key Factory Pattern
impact: HIGH
impactDescription: consistent keys and invalidation at any level of the hierarchy
tags: query, keys, factory, queryOptions, invalidation
versions: v4, v5
---

## Query Key Factory Pattern

Build every key for a feature from one factory, ordered from generic to specific. Then partial-key filters can target all queries, all lists, or a single item. In v5, have the factory return `queryOptions` so each key always travels with its `queryFn`.

**Incorrect (keys typed by hand in each place):**

```typescript
useQuery({ queryKey: ['todos', 'list', filters], queryFn: () => fetchTodos(filters) });
useQuery({ queryKey: ['todo', id], queryFn: () => fetchTodo(id) }); // 'todo' ≠ 'todos'
queryClient.invalidateQueries({ queryKey: ['todos'] }); // misses ['todo', id]
```

**Correct (v5, factory returns queryOptions):**

```typescript
import { queryOptions } from '@tanstack/react-query';

export const todoQueries = {
  all: () => ['todos'] as const,
  lists: () => [...todoQueries.all(), 'list'] as const,
  list: (filters: Filters) =>
    queryOptions({
      queryKey: [...todoQueries.lists(), filters],
      queryFn: () => fetchTodos(filters),
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: [...todoQueries.all(), 'detail', id],
      queryFn: () => fetchTodo(id),
    }),
};

useQuery(todoQueries.detail(id));
queryClient.invalidateQueries({ queryKey: todoQueries.all() });          // everything
queryClient.invalidateQueries({ queryKey: todoQueries.lists() });        // all lists
queryClient.invalidateQueries({ queryKey: todoQueries.detail(5).queryKey }); // one todo
```

**Correct (v4, plain key factory; `queryOptions` does not exist in v4):**

```typescript
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: Filters) => [...todoKeys.lists(), filters] as const,
  detail: (id: number) => [...todoKeys.all, 'detail', id] as const,
};

useQuery({ queryKey: todoKeys.detail(id), queryFn: () => fetchTodo(id) });
queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
```

- Since 5.103 (#11502), a partial filter with trailing `undefined` items no longer matches shorter keys: `{ queryKey: ['todos', undefined] }` does not match `['todos']`. Build the filter without the trailing `undefined` (e.g. `id == null ? todoQueries.all() : todoQueries.detail(id).queryKey`).
- The v5 ESLint rule `prefer-query-options` (in `recommended-strict`) flags keys typed by hand in `getQueryData` and `invalidateQueries` when a `queryOptions` factory exists.
- v5.64+ lets you constrain every key's shape app-wide by registering a `queryKey` type on `Register` (TypeScript guide).

Reference: [Query Keys](https://tanstack.com/query/v5/docs/framework/react/guides/query-keys) · [Query Options](https://tanstack.com/query/v5/docs/framework/react/guides/query-options) · [Filters](https://tanstack.com/query/v5/docs/framework/react/guides/filters) · [v4 Query Keys](https://tanstack.com/query/v4/docs/framework/react/guides/query-keys)
