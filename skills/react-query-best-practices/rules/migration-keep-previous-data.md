---
title: keepPreviousData Replaced by placeholderData Function
impact: HIGH
impactDescription: breaking change, common in pagination/filtering UIs
tags: migration, v5, keepPreviousData, placeholderData, pagination
versions: v4, v5
---

## keepPreviousData Replaced by placeholderData Function

v5 removed the `keepPreviousData` option and the `isPreviousData` flag, because they did mostly the same thing as `placeholderData` and `isPlaceholderData`. `placeholderData` now receives the previous query's data, so pass an identity function or the exported `keepPreviousData` helper.

**v4 (before):**

```typescript
const { data, isPreviousData } = useQuery({
  queryKey: ['projects', page],
  queryFn: () => fetchProjects(page),
  keepPreviousData: true,
});
```

**v5 (after):**

```typescript
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const { data, isPlaceholderData } = useQuery({
  queryKey: ['projects', page],
  queryFn: () => fetchProjects(page),
  placeholderData: keepPreviousData, // same as (previousData) => previousData
});
```

**Codemod** (run the object-syntax migration first; it transforms only calls whose first argument is an object literal):

```bash
npx jscodeshift@latest ./src --extensions=ts,tsx --parser=tsx \
  --transform=./node_modules/@tanstack/react-query/build/codemods/v5/keep-previous-data/keep-previous-data.cjs
```

The codemod moves the option only: rename `isPreviousData` to `isPlaceholderData` by hand.

**Behaviour differences to check after migrating:**
- Both report `success` while showing the previous data. The difference: v4 `keepPreviousData` kept data only when the previous query was in `success`; v5 `placeholderData: keepPreviousData` keeps the last defined data even if that query errored.
- The codemod converts only the literal `keepPreviousData: true` (other values get a warning) and adds the `keepPreviousData` import. It covers `useQuery`, `useInfiniteQuery`, `useQueries`, `setQueryDefaults` and `new QueryClient({ defaultOptions })`.
- `dataUpdatedAt` stays `0` while placeholder data is shown. `keepPreviousData` exposed the previous data's timestamp.
- Suspense hooks do not accept `placeholderData`; use `startTransition` there.

Reference: [Migrating to v5](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5#removed-keeppreviousdata-in-favor-of-placeholderdata-identity-function), [Paginated Queries](https://tanstack.com/query/v5/docs/framework/react/guides/paginated-queries), [v4 Paginated Queries](https://tanstack.com/query/v4/docs/framework/react/guides/paginated-queries)
