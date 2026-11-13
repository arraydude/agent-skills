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

- Review every existing `isLoading` by hand. A disabled query (`enabled: false`) is `isPending` but not `isLoading`, so swapping the names blindly changes what renders.
- Replace `status === 'loading'` with `status === 'pending'` in mutation checks too.

Reference: [Migrating to v5](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5#status-loading-has-been-changed-to-status-pending-and-isloading-has-been-changed-to-ispending-and-isinitialloading-has-now-been-renamed-to-isloading)
