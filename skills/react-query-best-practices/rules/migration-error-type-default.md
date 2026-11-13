---
title: Error Is the Default Error Type in v5
impact: MEDIUM
impactDescription: type-level breaking change; narrowing code and non-Error throws need review
tags: migration, v5, typescript, error, TError, Register
versions: v4, v5
---

## Error Is the Default Error Type in v5

In v4, `error` was typed `unknown`. In v5 it defaults to `Error`, because that is almost always what gets thrown. Delete casts that only existed to get from `unknown` to `Error`. If you throw something that is not an `Error`, declare that explicitly, either per call or globally via `Register`.

**v4 (before):**

```typescript
const { error } = useQuery({ queryKey: ['groups'], queryFn: fetchGroups });
//      ^? unknown
const message = error instanceof Error ? error.message : 'Unknown error';

useQuery<number, string>({ queryKey: ['n'], queryFn }); // generics needed in both
```

**v5 (after):**

```typescript
const { error } = useQuery({ queryKey: ['groups'], queryFn: fetchGroups });
//      ^? Error | null
const message = error?.message;

// throwing a non-Error still needs explicit generics (this disables inference for the rest)
useQuery<number, string>({
  queryKey: ['n'],
  queryFn: async () => {
    if (Math.random() > 0.5) throw 'some error';
    return 42;
  },
});
```

**v5: keep the v4 strictness everywhere with `Register`:**

```typescript
declare module '@tanstack/react-query' {
  interface Register {
    defaultError: unknown; // call sites must narrow explicitly
  }
}
```

- For subclasses such as `AxiosError`, narrow with a type guard (`axios.isAxiosError(error)`) rather than a generic.
- See `typescript-register-global-types` for registering a specific error class.

Reference: [Migrating to v5](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5#typescript-error-is-now-the-default-type-for-errors-instead-of-unknown) · [TypeScript](https://tanstack.com/query/v5/docs/framework/react/typescript#registering-a-global-error)
