---
title: Single Object Signature Required
impact: HIGH
impactDescription: breaking change, every positional-argument call must be rewritten
tags: migration, v5, signature, useQuery, useMutation, codemod
versions: v4, v5
---

## Single Object Signature Required

In v5, hooks, `QueryClient` methods and `queryCache.find`/`findAll` accept only a single options object. The positional overloads are gone. They are type errors, and React Query also throws a development-mode error for malformed `useQuery` calls. `getQueryData` and `getQueryState` now take just the `queryKey`.

**v4 (before):**

```typescript
useQuery(['todos'], fetchTodos, { staleTime: 5000 });
useMutation(postTodo, { onSuccess });
useIsFetching(['todos']);

queryClient.invalidateQueries(['todos'], { exact: true });
queryClient.getQueryData(['todo', id], { exact: true });
queryClient.fetchQuery(['todo', id], () => fetchTodo(id));
```

**v5 (after):**

```typescript
useQuery({ queryKey: ['todos'], queryFn: fetchTodos, staleTime: 5000 });
useMutation({ mutationFn: postTodo, onSuccess });
useIsFetching({ queryKey: ['todos'] });

queryClient.invalidateQueries({ queryKey: ['todos'], exact: true });
queryClient.getQueryData(['todo', id]); // key only, no filters
// 5.102+: fetchQuery is deprecated in favour of query()
queryClient.query({ queryKey: ['todo', id], queryFn: () => fetchTodo(id) });
// before 5.102: queryClient.fetchQuery({ queryKey: ['todo', id], queryFn: … })
```

**Codemod (`remove-overloads`):**

```bash
npx jscodeshift@latest ./src --extensions=ts,tsx --parser=tsx \
  --transform=./node_modules/@tanstack/react-query/build/codemods/v5/remove-overloads/remove-overloads.cjs
```

- `--parser=tsx` is required for TypeScript files, or the transform is not applied. For `.js`/`.jsx`, use `--extensions=js,jsx` and drop the parser flag.
- The codemod skips calls whose first argument is already an object with `queryKey`/`mutationKey`. It logs file:line for calls it cannot infer, so fix those by hand. Run prettier/eslint afterwards.
- The codemod does not move `fetchQuery`/`prefetchQuery`/`ensureQueryData` to `query()`; see `query-imperative-query-method`.

Reference: [Migrating to v5](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5#supports-a-single-signature-one-object)
