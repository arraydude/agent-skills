---
title: cacheTime Renamed to gcTime
impact: HIGH
impactDescription: breaking change; the old option is a type error and is ignored at runtime
tags: migration, v5, cacheTime, gcTime, codemod
versions: v4, v5
---

## cacheTime Renamed to gcTime

v5 renamed `cacheTime` to `gcTime`. The option does nothing while a query is in use. It is the time an *unused* query is kept before it is garbage collected, which "cacheTime" made sound like something else. The default is still 5 minutes.

**v4 (before):**

```typescript
const queryClient = new QueryClient({
  defaultOptions: { queries: { cacheTime: 10 * 60 * 1000 } },
});

useQuery({ queryKey: ['todos'], queryFn: fetchTodos, cacheTime: 10 * 60 * 1000 });
```

**v5 (after):**

```typescript
const queryClient = new QueryClient({
  defaultOptions: { queries: { gcTime: 10 * 60 * 1000 } },
});

useQuery({ queryKey: ['todos'], queryFn: fetchTodos, gcTime: 10 * 60 * 1000 });
```

**Codemod (`rename-properties`, also renames `useErrorBoundary` → `throwOnError`):**

```bash
npx jscodeshift@latest ./src --extensions=ts,tsx --parser=tsx \
  --transform=./node_modules/@tanstack/react-query/build/codemods/v5/rename-properties/rename-properties.cjs
```

- When persisting the cache, keep `gcTime` at or above the persister's `maxAge` (24h by default), or garbage collection discards the stored cache earlier than expected.

Reference: [Migrating to v5](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5#rename-cachetime-to-gctime)
