---
title: Select Option for Transformations
impact: MEDIUM
impactDescription: per-component views of one cache entry with fewer re-renders
tags: query, select, transform, optimization, rerender
versions: v4, v5
---

## Select Option for Transformations

Use `select` to derive what a component needs from the cached data. `select` changes only the returned `data`, never what is stored in the cache, so many components can share one cache entry and each subscribe to its own slice. A component that selects a slice re-renders only when that slice changes.

**Incorrect (component-specific view baked into the queryFn):**

```typescript
useQuery({
  queryKey: ['todos'],
  queryFn: async () => {
    const todos = await fetchTodos();
    return todos.filter((todo) => !todo.done); // the cache now holds only open todos
  },
});
```

Every other user of `['todos']` now sees the filtered list.

**Correct (cache raw data, select per component):**

```typescript
const selectOpen = (data: Todo[]) => data.filter((todo) => !todo.done);
const selectCount = (data: Todo[]) => data.length;

export const useTodos = <T = Todo[]>(select?: (data: Todo[]) => T) =>
  useQuery({ queryKey: ['todos'], queryFn: fetchTodos, select });

const openTodos = useTodos(selectOpen);
const count = useTodos(selectCount); // re-renders only when the length changes
```

In v5, override `select` per component on top of a shared `queryOptions` definition. Type inference follows `select`:

```typescript
const { data: groupName } = useQuery({ ...groupOptions(1), select: (data) => data.groupName });
```

- `select` re-runs only when `data` changes or the `select` function reference changes. An inline arrow therefore runs on every render. Hoist it to module scope, or wrap it in `useCallback` when it closes over props.
- `select` runs on data that is already cached, so it is not the place to signal errors. Validate in the `queryFn` if bad data should fail the query. A throwing `select` moves only this observer's result to `status: 'error'`, keeping the last selected `data`; the cache entry stays `success`. Since v5.102 (#11011, #11161), a throwing `select` also resets `isPlaceholderData`, and since v5.107 (#12540) repeated identical select errors no longer cause render loops.
- In `useQueries`, an inline `select` cannot infer its argument type and falls back to `unknown`. Annotate it, or put `select` inside the `queryOptions(...)` call (v5). Spreading `queryOptions` and adding `select` next to it still infers `unknown`.

Reference: [Render Optimizations](https://tanstack.com/query/v5/docs/framework/react/guides/render-optimizations) · [Query Options](https://tanstack.com/query/v5/docs/framework/react/guides/query-options) · [v4 useQuery: select](https://tanstack.com/query/v4/docs/framework/react/reference/useQuery)
