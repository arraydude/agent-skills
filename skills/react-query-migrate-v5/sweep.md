# Sweep searches

One row per rule in `../react-query-best-practices/rules/`. Run each in-scope
search with `rg -n --type-add 'src:*.{ts,tsx,js,jsx}' -t src '<pattern>'`
from the repo root, then open the rule for the fix. A hit is a place to read,
not proof of breakage: each pattern errs toward too many hits.

**Scope:** `4.x` rows apply only when migrating from v4. `since 5.N` rows apply when
the installed version is below 5.N, which includes every v4 repo.
**Runtime:** `runtime` marks changes that compile cleanly and still change
behaviour. They go in the step 7 report even when the sweep finds nothing.

| Rule | Scope | Search | Runtime |
|---|---|---|---|
| `migration-single-signature` | 4.x | `use(Query\|Queries\|InfiniteQuery\|Mutation\|IsFetching\|IsMutating)\(\s*[\['"\w]` · `(invalidate\|refetch\|cancel\|remove\|reset)Queries\(\s*[\['"\w]` · `getQuery(Data\|State)\([^)]*,` | |
| `migration-status-pending` | 4.x | `isLoading\|isInitialLoading\|['"]loading['"]` | runtime |
| `migration-cache-time-to-gc-time` | 4.x | `cacheTime` | |
| `migration-throw-on-error` | 4.x | `useErrorBoundary` | |
| `migration-keep-previous-data` | 4.x | `keepPreviousData\|isPreviousData` | runtime |
| `migration-query-callbacks-removed` | 4.x | `on(Success\|Error\|Settled)\s*[:(]` (hits inside `useMutation` are fine) | runtime |
| `migration-suspense-hooks` | 4.x | `suspense:\s*true` | |
| `migration-hydration-boundary` | 4.x | `\bHydrate\b\|useHydrate` | runtime |
| `migration-initial-page-param` | 4.x | `useInfiniteQuery\|InfiniteQuery\(\|infiniteQueryOptions` (check `initialPageParam`) · `fetchNextPage\(\s*\{` | |
| `migration-refetch-page-to-max-pages` | 4.x | `refetchPage` | |
| `migration-error-type-default` | 4.x | `useQuery<\|useMutation<\|error as \|instanceof Error` | |
| `migration-remove-method` | 4.x | `\.remove\(\)` | |
| `migration-refetch-interval-callback` | 4.x | `refetch(Interval\|OnWindowFocus\|OnReconnect\|OnMount)\s*:\s*\(` | |
| `migration-context-to-query-client` | 4.x | `context\s*:\|contextSharing` | |
| `migration-dehydrate-options` | 4.x | `dehydrate(Queries\|Mutations)\b` | |
| `migration-misc-breaking-changes` | 4.x | `logger\s*:\|isDataEqual\|hashQueryKey\|setQueryDefaults\|navigator\.onLine\|unstable_batchedUpdates` | runtime |
| `upgrade-mutation-callback-context` | since 5.89 | `on(Error\|Success\|Settled)\s*:\s*\(?[^)]*context` · `mutationFn\s*:\s*[\w.]+\s*[,}]` | |
| `upgrade-deprecated-apis` | since 5.91 | `isServer\|createSyncStoragePersister\|isCancelledError\|\bdirection\b\|useIs(Fetching\|Mutating)\(\s*\{[^}]*(fetchStatus\|status)` | |
| `upgrade-toolchain-floors` | since 5.100 | `"(typescript\|react)"\s*:` in `package.json` | |
| `query-imperative-query-method` | since 5.102 | `\.(fetch\|prefetch)(Infinite)?Query\(\|ensure(Infinite)?QueryData\(` | runtime |
| `upgrade-removed-experimental-apis` | since 5.102 | `experimental_prefetchInRender\|experimental_(before\|after)Query\|\.promise\b\|streamedQuery\|maxChunks\|useSuspenseInfiniteQuery\(` | |
| `upgrade-key-filter-trailing-undefined` | since 5.103 | `queryKey\s*:\s*\[[^\]]*undefined\s*\]` · key factories with optional trailing params | runtime |
