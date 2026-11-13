---
title: Hydrate Component Renamed to HydrationBoundary
impact: MEDIUM
impactDescription: breaking change for SSR/Next.js apps
tags: migration, v5, hydrate, HydrationBoundary, dehydrate, ssr, nextjs
versions: v4, v5
---

## Hydrate Component Renamed to HydrationBoundary

In v5, `<Hydrate>` was renamed to `<HydrationBoundary>` and the `useHydrate` hook was removed. The hydration APIs were changed to better support concurrent features and transitions.

**v4 (before):**

```typescript
import { Hydrate, QueryClientProvider } from '@tanstack/react-query';

<QueryClientProvider client={queryClient}>
  <Hydrate state={dehydratedState}>{children}</Hydrate>
</QueryClientProvider>;

dehydrate(queryClient, { dehydrateMutations: false });
```

**v5 (after):**

```typescript
import { HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';

<QueryClientProvider client={queryClient}>
  <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
</QueryClientProvider>;

dehydrate(queryClient, { shouldDehydrateMutation: () => false });
```

**Codemod:**

```bash
npx jscodeshift@latest ./src --extensions=ts,tsx --parser=tsx \
  --transform=./node_modules/@tanstack/react-query/build/codemods/v5/rename-hydrate/rename-hydrate.cjs
```

**Other hydration changes in v5:**
- `HydrationBoundary` hydrates only queries. To hydrate mutations, call the low-level `hydrate()` or use the `persistQueryClient` plugin.
- Timing: new queries are still hydrated during render, so SSR works as before. Queries already in the cache are hydrated in an effect, and only when the incoming data is newer. With Server Components passing fresh data on navigation, you may briefly see the old data. No action is needed.
- `dehydrate`'s boolean `dehydrateQueries` / `dehydrateMutations` options were removed. Use the `shouldDehydrateQuery` / `shouldDehydrateMutation` predicates instead (`() => false` restores the old opt-out).
- Since 5.84 the `state` prop is strictly typed as `DehydratedState | null | undefined`.

Reference: [Migrating to v5](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5#hydration-api-changes), [HydrationBoundary](https://tanstack.com/query/v5/docs/framework/react/reference/functions/HydrationBoundary), [v4 SSR](https://tanstack.com/query/v4/docs/framework/react/guides/ssr)
