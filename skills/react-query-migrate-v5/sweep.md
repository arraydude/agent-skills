# Sweep searches

One row per rule in `../react-query-best-practices/rules/`. Run each in-scope
search with `rg -n -U --type-add 'src:*.{ts,tsx,js,jsx}' -t src '<pattern>'`
from the repo root, then open the rule for the fix. `-U` lets a pattern span
the lines of a formatted call. In the table, `\|` is an escaped `|`
(alternation): unescape it before running, or rg searches for a literal pipe
and silently finds nothing. Patterns use `\x27` for a single quote so they fit
inside the single-quoted argument. A `·` separates independent patterns. A hit
is a place to read, not proof of breakage: each pattern errs toward too many
hits.

**Scope:** `4.x` rows apply only when migrating from v4. `since 5.N` rows apply when
the installed version is below 5.N, which includes every v4 repo.
**Runtime:** `runtime` marks changes that compile cleanly and still change
behaviour. They go in the step 7 report even when the sweep finds nothing.

| Rule | Scope | Search | Runtime |
|---|---|---|---|
| `migration-single-signature` | 4.x | `use(Query\|Queries\|InfiniteQuery\|Mutation\|IsFetching\|IsMutating)\(\s*[\[\x27"\w]` · `(invalidate\|refetch\|cancel\|remove\|reset)Queries\(\s*[\[\x27"\w]` · `getQuery(Data\|State)(<[^>]*>)?\(\s*\[[^\]]*\]\s*,` · `(fetch\|prefetch)(Infinite)?Query\(\s*\[\|ensureQueryData\(\s*\[` · `(setQueriesData\|getQueriesData\|isFetching\|find\|findAll)\(\s*\[` (the codemod skips calls on an imported client: see the rule) | |
| `migration-status-pending` | 4.x | `isLoading\|isInitialLoading\|[\x27"]loading[\x27"]` (the codemod leaves status strings as they are) | runtime |
| `migration-cache-time-to-gc-time` | 4.x | `cacheTime` | |
| `migration-throw-on-error` | 4.x | `useErrorBoundary` | |
| `migration-keep-previous-data` | 4.x | `keepPreviousData\|isPreviousData` (the codemod leaves the flag name as it is) | runtime |
| `migration-query-callbacks-removed` | 4.x | `on(Success\|Error\|Settled)\s*[:(]` (hits inside mutation options are fine) | runtime |
| `migration-suspense-hooks` | 4.x | `suspense\s*:` | |
| `migration-hydration-boundary` | 4.x | `\bHydrate\b\|useHydrate\|HydrationBoundary` | runtime |
| `migration-initial-page-param` | 4.x | `useInfiniteQuery\|InfiniteQuery\(\|infiniteQueryOptions` (each needs an initial page param) · `fetchNextPage\(\s*\{` | |
| `migration-refetch-page-to-max-pages` | 4.x | `refetchPage` | |
| `migration-error-type-default` | 4.x | `useQuery<\|useMutation<\|error as \|instanceof Error` | |
| `migration-remove-method` | 4.x | `\.remove\(\)` | |
| `migration-refetch-interval-callback` | 4.x | `refetch(Interval\|OnWindowFocus\|OnReconnect\|OnMount)\s*(:\s*)?\(` | |
| `migration-context-to-query-client` | 4.x | `context\s*:\|contextSharing` | |
| `migration-dehydrate-options` | 4.x | `dehydrate(Queries\|Mutations)\b` | |
| `migration-misc-breaking-changes` | 4.x | `logger\s*:\|isDataEqual\|hashQueryKey\|setQueryDefaults\|navigator\.onLine\|unstable_batchedUpdates` | runtime |
| `upgrade-mutation-callback-context` | since 5.89 | `on(Error\|Success\|Settled)\s*(:\s*)?\(?[^)]*context` · `mutationFn\s*:\s*[\w.]+\s*[,}]` | |
| `upgrade-deprecated-apis` | since 5.91 | `isServer\|createSyncStoragePersister\|isCancelledError\|\bdirection\b` | |
| `upgrade-deprecated-apis` (filter fields) | since 5.105 | `(useIs\|\.is)(Fetching\|Mutating)\(\s*\{[^}]*(fetchStatus\|status)` | |
| `upgrade-toolchain-floors` | since 5.100 | `"(typescript\|react)"\s*:`, run as `rg -n -g package.json` (the `-t src` command never searches `package.json`) | |
| `query-imperative-query-method` | since 5.102 | `\.(fetch\|prefetch)(Infinite)?Query\(\|ensure(Infinite)?QueryData\(` | runtime |
| `upgrade-removed-experimental-apis` | since 5.102 | `experimental_prefetchInRender\|experimental_(before\|after)Query\|\.promise\b\|\{[^}]*\bpromise\b[^}]*\}\s*=\s*use\w*Query\(\|streamedQuery\|maxChunks\|useSuspenseInfiniteQuery\(` | |
| `upgrade-key-filter-trailing-undefined` | since 5.103 | `queryKey\s*:\s*\[[^\]]*undefined\s*\]` · `\w+\?\s*:[^)]*\)\s*(:[^=]*)?=>\s*\(?\s*\[` (factories with an optional param) · `queryKey\s*:\s*[\w.]+\(` (filters built from a factory) | runtime |
