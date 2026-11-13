---
title: Enable the TanStack Query ESLint Plugin
impact: HIGH
impactDescription: catches missing key deps, lost render optimizations and unstable clients at lint time
tags: tooling, eslint, lint, exhaustive-deps
versions: v4, v5
---

## Enable the TanStack Query ESLint Plugin

Install `@tanstack/eslint-plugin-query` and enable its recommended config. Several mistakes other rules in this guide warn about become lint errors: missing query-key dependencies, rest destructuring, unstable deps, query functions with no return value, and a `QueryClient` created on every render.

**Incorrect (no plugin; these pass review unnoticed):**

```typescript
function App() {
  const queryClient = new QueryClient(); // new cache on every render
  const { data, ...rest } = useQuery({ queryKey: ['todo'], queryFn: () => api.getTodo(todoId) });
}
```

**Correct (v5, flat config; flat support shipped with 5.50):**

```js
// npm i -D @tanstack/eslint-plugin-query
import pluginQuery from '@tanstack/eslint-plugin-query';

export default [
  ...pluginQuery.configs['flat/recommended'], // or 'flat/recommended-strict'
];
```

**Correct (v5, legacy `.eslintrc`):**

```json
{ "extends": ["plugin:@tanstack/query/recommended"] }
```

**Correct (v4, `.eslintrc`):**

```json
{ "extends": ["plugin:@tanstack/eslint-plugin-query/recommended"] }
```

Rules in the current (v5) plugin. The release that added each rule is in parentheses where the changelog records it:

| Rule | Config | Catches |
|---|---|---|
| `exhaustive-deps` | recommended | queryFn variables missing from `queryKey` (`query-keys-as-dependencies`) |
| `stable-query-client` | recommended, fixable | `new QueryClient()` inside a component or hook |
| `no-rest-destructuring` (5.6) | recommended | `{ data, ...rest } = useQuery()` (`query-tracked-properties`) |
| `no-unstable-deps` (5.52) | recommended | the query or mutation result object in hook dependency arrays |
| `infinite-query-property-order` (5.57) | recommended, fixable | property order that breaks infinite-query type inference |
| `no-void-query-fn` (5.71) | recommended | a `queryFn` with no return value; needs typed linting, and reports nothing under Oxlint |
| `mutation-property-order` (5.78) | recommended, fixable | `onMutate` order that breaks mutation inference |
| `prefer-query-options` (react-query 5.96) | recommended-strict | key and fn defined without `queryOptions`, or hand-typed keys in `QueryClient` calls (`query-options-helper`) |

- `exhaustive-deps` accepts `allowlist.variables` and `allowlist.types` for stable clients and config objects.
- Turn off `no-rest-destructuring` only if you set `notifyOnChangeProps` manually.
- v4: the plugin ships four rules, all in `recommended`: `exhaustive-deps`, `stable-query-client`, `prefer-query-object-syntax` and `no-deprecated-options`. The last two flag code v5 removes (positional signatures, and options such as `onSuccess` on `useQuery`), so turning them on before a v5 upgrade shrinks the migration. v5 dropped `prefer-query-object-syntax`: delete it from the config when upgrading.

Reference: [ESLint Plugin Query](https://tanstack.com/query/v5/docs/eslint/eslint-plugin-query) · [v4 ESLint Plugin Query](https://tanstack.com/query/v4/docs/eslint/eslint-plugin-query)
