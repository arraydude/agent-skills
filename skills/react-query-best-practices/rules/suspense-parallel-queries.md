---
title: Use useSuspenseQueries for Multiple Suspense Queries
impact: HIGH
impactDescription: several useSuspenseQuery calls in one component fetch one after another
tags: suspense, useSuspenseQueries, waterfall, parallel
versions: v5
---

## Use useSuspenseQueries for Multiple Suspense Queries

Each `useSuspenseQuery` suspends the component until it resolves, so the next call in the same component doesn't start fetching until the previous one finishes. With regular `useQuery` these would run in parallel. When a component needs more than one suspense query, put them all in one `useSuspenseQueries` call.

**Incorrect (three serial requests):**

```typescript
function App() {
  const users = useSuspenseQuery({ queryKey: ['users'], queryFn: fetchUsers });
  const teams = useSuspenseQuery({ queryKey: ['teams'], queryFn: fetchTeams });
  const projects = useSuspenseQuery({ queryKey: ['projects'], queryFn: fetchProjects });
  // nothing renders until all three have finished, one after another
}
```

**Correct (fetched in parallel):**

```typescript
function App() {
  const [users, teams, projects] = useSuspenseQueries({
    queries: [
      { queryKey: ['users'], queryFn: fetchUsers },
      { queryKey: ['teams'], queryFn: fetchTeams },
      { queryKey: ['projects'], queryFn: fetchProjects },
    ],
  });
}
```

- If a child component needs data from a different query, prefetch it above the `<Suspense>` boundary with `usePrefetchQuery` instead (see `prefetch-flatten-waterfalls`).
- Queries inside `useSuspenseQueries` can't use `enabled`, `placeholderData` or `throwOnError`, the same as `useSuspenseQuery`.
- Serial fetching is what you want for dependent queries, because suspense queries in one component run in order.

v4 users: see `migration-suspense-hooks` for moving from `suspense: true` to the v5 hooks.

Reference: [Performance & Request Waterfalls](https://tanstack.com/query/v5/docs/framework/react/guides/request-waterfalls#single-component-waterfalls--serial-queries), [useSuspenseQueries](https://tanstack.com/query/v5/docs/framework/react/reference/functions/useSuspenseQueries)
