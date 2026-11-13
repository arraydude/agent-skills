---
title: Status Check Order
impact: MEDIUM
impactDescription: correct loading/error/data rendering and TypeScript narrowing
tags: query, status, loading, error, isPending
versions: v4, v5
---

## Status Check Order

For most queries, the docs' default order is fine: check the "no data yet" state, then the error, then render data. TypeScript narrows `data` to defined after both checks. Use data-first ordering only when a background refetch error should leave the cached data on screen.

**Incorrect (renders data without handling the states before it):**

```typescript
const { data } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });
return <List items={data} />; // data is undefined while pending or after a failed first fetch
```

**Correct (v5, default order):**

```typescript
const { isPending, isError, data, error } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });

if (isPending) return <Skeleton />;
if (isError) return <ErrorView message={error.message} />;
return <List items={data} />; // narrowed: data is defined
```

**Correct (v4, default order; v4 calls the no-data state `isLoading`):**

```typescript
const { isLoading, isError, data, error } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });

if (isLoading) return <Skeleton />;
if (isError) return <ErrorView error={error} />; // v4 types error as unknown by default
return <List items={data} />;
```

**Alternative (data first, keep cached data visible when a refetch fails):**

```typescript
// v5 names; in v4 use isLoading instead of isPending
const { data, error, isPending } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });

if (data !== undefined) return <List items={data} stale={!!error} />;
if (error) return <ErrorView message={error.message} />;
if (isPending) return <Skeleton />;
```

- A query whose refetch fails keeps its previous `data` and moves to `status: 'error'`, so with the default order the error branch hides that data.
- Compare against `undefined`, not truthiness: `0`, `''` and `false` are valid data.
- `isPending` (v5) / `isLoading` (v4) means "no data yet", not "fetching". A disabled or offline query can stay in it without fetching (see `query-status-vs-fetch-status`).

Reference: [Queries](https://tanstack.com/query/v5/docs/framework/react/guides/queries) · [Status Checks (TkDodo)](https://tkdodo.eu/blog/status-checks-in-react-query) · [v4 Queries](https://tanstack.com/query/v4/docs/framework/react/guides/queries)
