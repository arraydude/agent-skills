---
title: dehydrate Boolean Options Replaced by Predicates
impact: LOW
impactDescription: breaking change for SSR and persistence code that filters dehydration
tags: migration, v5, ssr, dehydrate, hydration, shouldDehydrateQuery
versions: v4, v5
---

## dehydrate Boolean Options Replaced by Predicates

v5 removed the `dehydrateQueries` and `dehydrateMutations` booleans from `dehydrate`. Pass the predicate functions `shouldDehydrateQuery` and `shouldDehydrateMutation` instead. Use `() => false` to skip a kind entirely. If you don't pass them, the defaults dehydrate successful queries and paused mutations.

**v4 (before):**

```typescript
import { dehydrate } from '@tanstack/react-query';

const state = dehydrate(queryClient, {
  dehydrateQueries: true,
  dehydrateMutations: false,
});
```

**v5 (after):**

```typescript
import { dehydrate, defaultShouldDehydrateQuery } from '@tanstack/react-query';

const state = dehydrate(queryClient, {
  shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query),
  shouldDehydrateMutation: () => false,
});
```

- `<HydrationBoundary>` (formerly `<Hydrate>`) hydrates only queries in v5. To restore mutations, use the low-level `hydrate()` or the persistQueryClient plugin (see `migration-hydration-boundary`).

Reference: [Migrating to v5](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5#new-dehydrate-api) · [dehydrate](https://tanstack.com/query/v5/docs/framework/react/reference/functions/dehydrate)
