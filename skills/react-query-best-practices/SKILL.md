---
name: react-query-best-practices
description: TanStack Query (React Query) v4 and v5 rules for queries, mutations, caching, SSR, suspense, TypeScript and testing, plus every v4 → v5 and v5.x breaking change with its fix. Use when writing, reviewing or debugging code that uses @tanstack/react-query (useQuery, useMutation, queryClient, invalidation), or when upgrading it.
license: MIT
metadata:
  author: arraydude
  version: "2.0.0"
  reactQueryVersions: "4.x, 5.x"
---

# React Query Best Practices

Rules for `@tanstack/react-query` v4 and v5, checked against the official v5.107
docs and changelog and based on TkDodo's blog series. Each rule lives in
`rules/<id>.md` with incorrect and correct code.

## Pin the version first

Read the installed version from the lockfile entry for `@tanstack/react-query`
(the `package.json` range can lie). Then:

- Apply the rules whose `versions` frontmatter includes that major.
- Skip a rule whose `since` is above the installed minor. Its last line names
  the migration path.
- Inside a rule, use the code block labelled for that version. Unlabelled code
  is valid for every version the rule lists.
- Only the v3 package `react-query` present → these rules don't apply.

To move a repo to the latest v5, run the `/react-query-migrate-v5` skill. It
applies the `migration-` and `upgrade-` rules in order.

## Core mental model

1. **React Query is an async state manager**, not a fetching library.
2. **Server state stays in the cache.** Keep it out of client-state stores.
3. **Stale-while-revalidate:** cached data shows at once, refetches run in the background.
4. **Query keys are dependencies:** every variable the `queryFn` reads goes in the key.

## Rule categories

| Priority | Category | Impact | Prefix |
|---|---|---|---|
| 1 | Query Keys & Patterns | CRITICAL | `query-` |
| 2 | Mutations & Updates | CRITICAL | `mutation-` |
| 3 | Caching Strategy | HIGH | `cache-` |
| 4 | SSR & Hydration | HIGH | `ssr-` |
| 5 | Suspense, Prefetching & Infinite Queries | HIGH | `suspense-`, `prefetch-`, `infinite-` |
| 6 | WebSocket Integration | HIGH | `websocket-` |
| 7 | TypeScript | MEDIUM | `typescript-` |
| 8 | Testing | MEDIUM | `testing-` |
| 9 | Tooling | MEDIUM | `tooling-` |
| 10 | Common Pitfalls | MEDIUM | `troubleshoot-` |
| 11 | Migration v4 → v5 | HIGH | `migration-` |
| 12 | Upgrading within v5 | HIGH | `upgrade-` |

Tags below: `[v5]` = v5 only; `[v5.102+]` = needs that minor. No tag = v4 and v5.

## Quick reference

### 1. Query Keys & Patterns (CRITICAL)

- `query-keys-as-dependencies` - Every changing variable the queryFn reads goes in the key
- `query-key-factory` - Hierarchical keys from one factory (v5: returns `queryOptions`)
- `query-options-helper` [v5] - One `queryOptions` definition for hooks, prefetching and cache reads
- `query-imperative-query-method` [v5.102+] - `queryClient.query()` replaces fetch/prefetch/ensure
- `query-dependent-enabled` - `enabled` (or `skipToken` in v5) for dependent queries
- `query-status-vs-fetch-status` - `status` is about data, `fetchStatus` about the queryFn
- `query-status-check-order` - Pending → error → data, with data-first as the alternative
- `query-select-transforms` - Cache raw data, transform with a stable `select`
- `query-placeholder-vs-initial` - `initialData` is cached, `placeholderData` is not; paginate with previous data
- `query-tracked-properties` - Destructure only what you read; the result object is not stable

### 2. Mutations & Updates (CRITICAL)

- `mutation-invalidation` - Invalidate by key prefix and return the promise
- `mutation-optimistic-via-variables` - Render pending `variables`: no cache writes, no rollback
- `mutation-optimistic-updates` - Cache-level optimistic update: cancel, snapshot, roll back, return the invalidation
- `mutation-direct-cache-update` - `setQueryData` from the response with an `undefined`-safe updater
- `mutation-prefer-mutate` - `mutate` with callbacks; `mutateAsync` only for chained or parallel calls
- `mutation-callback-separation` - Cache logic in the hook, UI effects at the call site
- `mutation-state-across-components` [v5] - `useMutationState` to read mutations elsewhere
- `mutation-scope-serial` [v5.31+] - Shared `scope.id` runs mutations in order
- `mutation-options-factory` [v5.89+] - Share mutation definitions with `mutationOptions`

### 3. Caching Strategy (HIGH)

- `cache-stale-time` - `staleTime` is the main refetch control
- `cache-refetch-triggers` - Keep refetch triggers on and tune `staleTime` instead
- `cache-static-vs-infinity` [v5.79+] - `Infinity` when you invalidate, `'static'` for session-fixed data

### 4. SSR & Hydration (HIGH)

- `ssr-query-client-per-request` - One `QueryClient` per request on the server, never module-level
- `ssr-prefetch-dehydrate-hydrate` - Prefetch, dehydrate, hydrate instead of `initialData`
- `ssr-default-stale-time` - Default `staleTime` above zero so hydrated data doesn't refetch at once

### 5. Suspense, Prefetching & Infinite Queries (HIGH)

- `suspense-parallel-queries` [v5] - `useSuspenseQueries` instead of several `useSuspenseQuery` calls
- `prefetch-flatten-waterfalls` - Hoist or prefetch child queries to flatten waterfalls
- `infinite-query-patterns` - Guarded `fetchNextPage`, aligned pages/pageParams, `maxPages`

### 6. WebSocket Integration (HIGH)

- `websocket-event-invalidation` - Socket events carry keys, the client invalidates
- `websocket-stale-time-infinity` - `staleTime: Infinity` (not `'static'`) for socket-driven data
- `websocket-reconnection` - Invalidate what the socket owns on reconnect

### 7. TypeScript (MEDIUM)

- `typescript-infer-dont-specify` - Type the queryFn, let the hooks infer
- `typescript-zod-validation` - Parse responses in the queryFn
- `typescript-register-global-types` [v5] - `Register` for error, meta and key types

### 8. Testing (MEDIUM)

- `testing-fresh-client` - New client per test, `retry: false`
- `testing-msw-mocking` - Mock the network with MSW, not the hooks

### 9. Tooling (MEDIUM)

- `tooling-eslint-plugin` - `@tanstack/eslint-plugin-query` recommended config

### 10. Common Pitfalls (MEDIUM)

- `troubleshoot-copy-to-state` - Read from the hook; never copy query data into state
- `troubleshoot-fetch-not-reject` - Throw on `!res.ok`; never resolve `undefined`

### 11. Migration v4 → v5 (HIGH)

- `migration-single-signature` - Object-only signatures (codemod `remove-overloads`)
- `migration-status-pending` - `loading` → `pending`, `isLoading` → `isPending` (codemod `is-loading`)
- `migration-cache-time-to-gc-time` - `cacheTime` → `gcTime` (codemod `rename-properties`)
- `migration-throw-on-error` - `useErrorBoundary` → `throwOnError` (codemod `rename-properties`)
- `migration-keep-previous-data` - `keepPreviousData` → `placeholderData: keepPreviousData` (codemod)
- `migration-query-callbacks-removed` - Query `onSuccess`/`onError`/`onSettled` removed
- `migration-suspense-hooks` - `suspense: true` → `useSuspenseQuery` and siblings
- `migration-hydration-boundary` - `Hydrate` → `HydrationBoundary` (codemod `rename-hydrate`)
- `migration-initial-page-param` - `initialPageParam` required; manual `pageParam` removed
- `migration-refetch-page-to-max-pages` - `refetchPage` → `maxPages` with both page getters
- `migration-error-type-default` - `Error` is the default error type
- `migration-remove-method` - `query.remove()` → `queryClient.removeQueries()`
- `migration-refetch-interval-callback` - `refetchInterval` callback receives only `query`
- `migration-context-to-query-client` - `context` and `contextSharing` → `queryClient` argument
- `migration-dehydrate-options` - `dehydrate` booleans → `shouldDehydrate*` predicates
- `migration-misc-breaking-changes` - Floors, `logger`, `hashKey`, `isDataEqual`, focus/online, server retry

### 12. Upgrading within v5 (HIGH)

`query-imperative-query-method` [v5.102+] also belongs here: it covers the 5.102 deprecations.

- `upgrade-key-filter-trailing-undefined` [v5.103+] - Filters ending in `undefined` no longer match shorter keys
- `upgrade-removed-experimental-apis` [v5.102+] - `promise`/`experimental_prefetchInRender` and other removed experiments
- `upgrade-mutation-callback-context` [v5.89+] - `onMutateResult` and the mutation function context
- `upgrade-deprecated-apis` [v5.91+] - `isServer`, sync persister, `isCancelledError`, `direction`, filter fields
- `upgrade-toolchain-floors` [v5.100+] - TypeScript and React ranges

## Full compiled document

`AGENTS.md` holds every rule expanded, in this order.
