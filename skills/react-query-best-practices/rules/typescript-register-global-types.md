---
title: Register Global Error, Meta and Key Types
impact: MEDIUM
impactDescription: app-wide typing without generics at every call site
tags: typescript, Register, defaultError, meta, queryKey, mutationKey, module-augmentation
versions: v5
since: "5.0"
---

## Register Global Error, Meta and Key Types

Augment the `Register` interface once instead of passing generics at every call site. Inference keeps working, and `error`, `meta`, `queryKey` and `mutationKey` get your types across the whole library surface.

**Incorrect (generics and casts at each call site):**

```typescript
const { error } = useQuery<Todo[], ApiError>({ queryKey: ['todos'], queryFn: fetchTodos });
// passing TError turns off inference for the other type parameters

useQuery({ queryKey: ['todos'], queryFn: fetchTodos, meta: { toast: 'oops' } });
// meta is Record<string, unknown>; a typo like `toats` is accepted
```

**Correct (one augmentation, e.g. in `src/react-query.d.ts`):**

```typescript
import '@tanstack/react-query';

type AppMeta = { errorMessage?: string }; // a type alias, so unknown keys like `toats` are rejected

type AppQueryKey = ['todos' | 'users' | 'settings', ...ReadonlyArray<unknown>];

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError;   // or `unknown` to force narrowing everywhere
    queryMeta: AppMeta;
    mutationMeta: AppMeta;
    queryKey: AppQueryKey;    // since 5.64
    mutationKey: AppQueryKey; // since 5.64
  }
}

const { error } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });
//      ^? ApiError | null, and data is still inferred

useQuery({ queryKey: ['todoz'], queryFn: fetchTodos }); // type error: not a registered key root
```

- The `meta` types must extend `Record<string, unknown>`. Key types must extend an array type.
- Registered meta pairs well with global callbacks such as `new QueryCache({ onError: (error, query) => toast(query.meta?.errorMessage) })`.
- v4 has no `Register`; its errors are `unknown`. v4 can still type meta by augmenting the `QueryMeta` / `MutationMeta` interfaces. Upgrade first (see `migration-error-type-default`).

Reference: [TypeScript](https://tanstack.com/query/v5/docs/framework/react/typescript#registering-a-global-error)
