---
title: Status "loading" Renamed to "pending"
impact: HIGH
impactDescription: breaking change, and isLoading silently changes meaning
tags: migration, v5, status, isPending, isLoading, codemod
versions: v4, v5
---

## Status "loading" Renamed to "pending"

In v5, `status: 'loading'` became `'pending'` and `isLoading` became `isPending`, for queries and mutations alike. A new `isLoading` on queries means `isPending && isFetching`, which is what v4's `isInitialLoading` meant. `isInitialLoading` is deprecated.

**v4 (before):**

```typescript
const { status, isLoading, isInitialLoading } = useQuery({ queryKey, queryFn });
if (status === 'loading') return <Spinner />;
if (isInitialLoading) return <Spinner />;

const mutation = useMutation({ mutationFn });
<button disabled={mutation.isLoading} />;
```

**v5 (after):**

```typescript
const { status, isPending, isLoading } = useQuery({ queryKey, queryFn });
if (status === 'pending') return <Spinner />;
if (isLoading) return <Spinner />; // pending AND fetching (was isInitialLoading)

const mutation = useMutation({ mutationFn });
<button disabled={mutation.isPending} />;
```

**Codemod (`is-loading`, since 5.9):**

```bash
npx jscodeshift@latest ./src --extensions=ts,tsx --parser=tsx \
  --transform=./node_modules/@tanstack/react-query/build/codemods/v5/is-loading/is-loading.cjs
```

- The rename keeps v4 behaviour: v4 `isLoading` is v5 `isPending`. An `isLoading` left unrenamed now means pending *and* fetching, which is false for a disabled query, so it silently changes what renders.
- The codemod only targets `useQuery` and `useMutation` results, skips `isInitialLoading`, and once it finds a destructured `isLoading` it renames every `isLoading` identifier in that scope, unrelated ones included. Review its diff.
- v4.40+ mutations already expose `isPending`.
- The codemod renames the `isLoading` flag only. Replace `status === 'loading'` with `status === 'pending'` by hand, in query and mutation checks alike.

Reference: [Migrating to v5](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5#status-loading-has-been-changed-to-status-pending-and-isloading-has-been-changed-to-ispending-and-isinitialloading-has-now-been-renamed-to-isloading)
