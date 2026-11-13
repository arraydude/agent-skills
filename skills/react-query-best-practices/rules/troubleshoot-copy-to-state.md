---
title: Copying Query Data to State
impact: HIGH
impactDescription: keeps the cache as the single source of truth
tags: troubleshoot, state, anti-pattern, select, getQueryData
versions: v4, v5
---

## Copying Query Data to State

Read server data from the query, not from a `useState` copy. The cache updates after background refetches, invalidations and `setQueryData`, and a local copy misses all of them. Derive values with `select`, and reach the same data elsewhere by calling the same query hook.

**Incorrect (duplicated state synced by an effect):**

```typescript
const { data } = useQuery({ queryKey: ['user'], queryFn: fetchUser });
const [user, setUser] = useState(data);

useEffect(() => {
  if (data) setUser(data);
}, [data]);
```

**Correct (read the query; derive with select):**

```typescript
const { data: user } = useQuery({ queryKey: ['user'], queryFn: fetchUser });

const { data: userName } = useQuery({
  queryKey: ['user'],
  queryFn: fetchUser,
  select: (user) => user.name,
});
```

**Incorrect (`getQueryData` used as a global store in render):**

```typescript
function Header() {
  const user = queryClient.getQueryData(['user']); // non-reactive: Header never updates
  return <span>{user?.name}</span>;
}
```

**Correct (call the query hook again; it is deduplicated and served from cache):**

```typescript
const useUser = () => useQuery({ queryKey: ['user'], queryFn: fetchUser, staleTime: 5 * 60 * 1000 });

function Header() {
  const { data: user } = useUser();
  return <span>{user?.name}</span>;
}
```

- `queryClient.getQueryData` is an imperative, non-reactive read. Use it only in callbacks that need the latest value, such as optimistic updates.
- Several components using the same key share one cache entry. A second instance gets the cached data immediately, and set a `staleTime` if it should not trigger a background refetch as well.

Reference: [Does TanStack Query replace client state?](https://tanstack.com/query/v5/docs/framework/react/guides/does-this-replace-client-state) · [QueryClient.getQueryData](https://tanstack.com/query/v5/docs/framework/react/reference/classes/QueryClient) · [v4 Does this replace client state?](https://tanstack.com/query/v4/docs/framework/react/guides/does-this-replace-client-state)
