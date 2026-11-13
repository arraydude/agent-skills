---
title: Dependent Queries with enabled / skipToken
impact: HIGH
impactDescription: prevents fetches with undefined parameters
tags: query, enabled, skipToken, dependent, conditional
versions: v4, v5
---

## Dependent Queries with enabled / skipToken

When a query needs a value that isn't available yet, such as the result of another query or user input, disable it until the value exists. In v5 with TypeScript, prefer `skipToken`: it disables the query and narrows the parameter, so no non-null assertion is needed.

**Incorrect (fires immediately with `undefined`):**

```typescript
const { data: user } = useQuery({ queryKey: ['user', email], queryFn: () => getUser(email) });

const { data: projects } = useQuery({
  queryKey: ['projects', user?.id],
  queryFn: () => fetchProjects(user?.id), // called with undefined
});
```

**Correct (v5, skipToken, since 5.25):**

```typescript
import { skipToken, useQuery } from '@tanstack/react-query';

const userId = user?.id;
const { data: projects } = useQuery({
  queryKey: ['projects', userId],
  queryFn: userId ? () => fetchProjects(userId) : skipToken,
});
```

**Correct (v4 and v5, `enabled`):**

```typescript
const userId = user?.id;
const { data: projects } = useQuery({
  queryKey: ['projects', userId],
  queryFn: () => fetchProjects(userId!),
  enabled: !!userId,
});
```

- Calling `refetch()` on a query disabled with `skipToken` throws "Missing queryFn". If the query must also be triggered manually, use `enabled: false`.
- A disabled query with no cached data sits in `pending` (v4: `loading`) with `fetchStatus: 'idle'`, so don't show a spinner from that alone. Use `isLoading` in v5 (`isPending && isFetching`) or `isInitialLoading` in v4 (see `query-status-vs-fetch-status`).
- v5.48+: `enabled` also accepts `(query) => boolean`. v5.83+: the result exposes `isEnabled`.
- A disabled query also ignores `invalidateQueries` / `refetchQueries` calls.
- Dependent queries are request waterfalls. If you can, add an endpoint that takes the first input directly (e.g. projects by email).

Reference: [Dependent Queries](https://tanstack.com/query/v5/docs/framework/react/guides/dependent-queries) · [Disabling Queries](https://tanstack.com/query/v5/docs/framework/react/guides/disabling-queries) · [v4 Dependent Queries](https://tanstack.com/query/v4/docs/framework/react/guides/dependent-queries)
