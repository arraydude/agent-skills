---
title: remove() Method Removed from useQuery
impact: MEDIUM
impactDescription: breaking change, refactor required where used
versions: v4, v5
tags: migration, v5, remove, removeQueries
---

## remove() Method Removed from useQuery

In v5, the `remove()` method on the `useQuery` result was removed. Use `queryClient.removeQueries()` instead.

**Why:** removing a query that a mounted component still observes only causes a hard loading state on its next render. Removal is meant for imperative cleanup such as logout, which `queryClient.removeQueries` covers. Both call the same `queryCache.remove`, so behaviour is unchanged.

**v4 (before):**

```typescript
const query = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
});

const handleReset = () => {
  query.remove();
};
```

**v5 (after):**

```typescript
const queryClient = useQueryClient();
const query = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
});

const handleReset = () => {
  queryClient.removeQueries({ queryKey: ['todos'], exact: true });
};
```

`remove()` dropped only this exact query. Without `exact: true`, `removeQueries({ queryKey: ['todos'] })` also removes `['todos', …]`.

Reference: [Migrating to v5](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5#the-remove-method-has-been-removed-from-usequery)
