---
title: Use queryOptions to Share Query Definitions
impact: HIGH
impactDescription: one key + fn definition reused by hooks, prefetching and cache reads
tags: query, queryOptions, typescript, keys
versions: v5
since: "5.0"
---

## Use queryOptions to Share Query Definitions

Define each query once with `queryOptions` and pass the result everywhere: `useQuery`, `useSuspenseQuery`, `useQueries`, `queryClient.query` and cache helpers. Keeping the key and the `queryFn` together prevents one key from being used with two different functions. The returned `queryKey` also carries the data type, so `getQueryData` and `setQueryData` are typed without generics.

**Incorrect (key and fn repeated; cache reads untyped):**

```typescript
function useGroup(id: number) {
  return useQuery({ queryKey: ['groups', id], queryFn: () => fetchGroup(id) });
}

// elsewhere: a different key, and data is unknown
const cached = queryClient.getQueryData(['group', id]);
```

**Correct:**

```typescript
import { queryOptions, useQueries, useQuery } from '@tanstack/react-query';

export function groupOptions(id: number) {
  return queryOptions({
    queryKey: ['groups', id],
    queryFn: () => fetchGroup(id),
    staleTime: 5 * 1000,
  });
}

useQuery(groupOptions(1));
useQueries({ queries: [groupOptions(1), groupOptions(2)] });
await queryClient.query(groupOptions(23)); // v5.102+, see query-imperative-query-method

const cached = queryClient.getQueryData(groupOptions(42).queryKey);
//    ^? Group | undefined
queryClient.invalidateQueries({ queryKey: groupOptions(42).queryKey });
```

Override options per component; type inference follows `select`:

```typescript
const { data: name } = useQuery({ ...groupOptions(1), select: (group) => group.name });
```

- Use `infiniteQueryOptions` for infinite queries.
- Type inference via the key does not work for `getQueriesData`, which returns heterogeneous tuples. Pass the generic explicitly there.
- ESLint `prefer-query-options` (in `recommended-strict`, added with react-query 5.96) enforces this pattern, including reusing `.queryKey` in `QueryClient` methods and filters.
- v4 has no `queryOptions`. Use a key factory (`query-key-factory`) until you migrate (`migration-single-signature`).

Reference: [Query Options](https://tanstack.com/query/v5/docs/framework/react/guides/query-options) · [TypeScript: Typing Query Options](https://tanstack.com/query/v5/docs/framework/react/typescript) · [prefer-query-options](https://tanstack.com/query/v5/docs/eslint/prefer-query-options)
