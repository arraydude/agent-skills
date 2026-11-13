#!/usr/bin/env node
// Usage: node sweep.mjs <installed @tanstack/react-query version> [repo root]
//
// Searches the repo for every code shape a migration-* or upgrade-* rule
// fixes, limited to the rules in scope for the installed version. Each rule's
// fix lives in ../react-query-best-practices/rules/<rule>.md. A hit is a place
// to read, not proof of breakage: the patterns err toward too many hits.
// Patterns run over whole files, so they match calls split across lines.
//
// scope '4.x'      → applies when migrating from v4
// scope 'since X'  → applies when the installed version is below X (every v4 repo)
// runtime: true    → compiles cleanly but changes behaviour; always reported
import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROWS = [
  { rule: 'migration-single-signature', scope: '4.x', patterns: [
    /use(Query|Queries|InfiniteQuery|Mutation|IsFetching|IsMutating)\(\s*[\['"\w]/,
    /(invalidate|refetch|cancel|remove|reset)Queries\(\s*[\['"\w]/,
    /getQuery(Data|State)(<[^>]*>)?\(\s*\[[^\]]*\]\s*,/,
    /(fetch|prefetch)(Infinite)?Query\(\s*\[|ensureQueryData\(\s*\[/,
    /(setQueriesData|getQueriesData|isFetching|find|findAll)\(\s*\[/,
  ] },
  { rule: 'migration-status-pending', scope: '4.x', runtime: true, patterns: [/isLoading|isInitialLoading|['"]loading['"]/] },
  { rule: 'migration-cache-time-to-gc-time', scope: '4.x', patterns: [/cacheTime/] },
  { rule: 'migration-throw-on-error', scope: '4.x', patterns: [/useErrorBoundary/] },
  { rule: 'migration-keep-previous-data', scope: '4.x', runtime: true, patterns: [/keepPreviousData|isPreviousData/] },
  { rule: 'migration-query-callbacks-removed', scope: '4.x', runtime: true, patterns: [/on(Success|Error|Settled)\s*[:(]/] },
  { rule: 'migration-suspense-hooks', scope: '4.x', patterns: [/suspense\s*:/] },
  { rule: 'migration-hydration-boundary', scope: '4.x', runtime: true, patterns: [/\bHydrate\b|useHydrate|HydrationBoundary/] },
  { rule: 'migration-initial-page-param', scope: '4.x', patterns: [/useInfiniteQuery|InfiniteQuery\(|infiniteQueryOptions/, /fetchNextPage\(\s*\{/] },
  { rule: 'migration-refetch-page-to-max-pages', scope: '4.x', patterns: [/refetchPage/] },
  { rule: 'migration-error-type-default', scope: '4.x', patterns: [/useQuery<|useMutation<|error as |instanceof Error/] },
  { rule: 'migration-remove-method', scope: '4.x', patterns: [/\.remove\(\)/] },
  { rule: 'migration-refetch-interval-callback', scope: '4.x', patterns: [/refetch(Interval|OnWindowFocus|OnReconnect|OnMount)\s*(:\s*)?\(/] },
  { rule: 'migration-context-to-query-client', scope: '4.x', patterns: [/context\s*:|contextSharing/] },
  { rule: 'migration-dehydrate-options', scope: '4.x', patterns: [/dehydrate(Queries|Mutations)\b/] },
  { rule: 'migration-misc-breaking-changes', scope: '4.x', runtime: true, patterns: [/logger\s*:|isDataEqual|hashQueryKey|setQueryDefaults|navigator\.onLine|unstable_batchedUpdates/] },
  { rule: 'upgrade-mutation-callback-context', scope: 'since 5.89', patterns: [/on(Error|Success|Settled)\s*(:\s*)?\(?[^)]*context/, /mutationFn\s*:\s*[\w.]+\s*[,}]/] },
  { rule: 'upgrade-deprecated-apis', scope: 'since 5.91', patterns: [/isServer|createSyncStoragePersister|isCancelledError|\bdirection\b/] },
  { rule: 'upgrade-deprecated-apis', scope: 'since 5.105', patterns: [/(useIs|\.is)(Fetching|Mutating)\(\s*\{[^}]*(fetchStatus|status)/] },
  { rule: 'upgrade-toolchain-floors', scope: 'since 5.100', files: 'package.json', patterns: [/"(typescript|react|@types\/react)"\s*:/] },
  { rule: 'query-imperative-query-method', scope: 'since 5.102', runtime: true, patterns: [/\.(fetch|prefetch)(Infinite)?Query\(|ensure(Infinite)?QueryData\(/] },
  { rule: 'upgrade-removed-experimental-apis', scope: 'since 5.102', patterns: [
    /experimental_prefetchInRender|experimental_(before|after)Query|\.promise\b|streamedQuery|maxChunks|useSuspenseInfiniteQuery\(/,
    /\{[^}]*\bpromise\b[^}]*\}\s*=\s*use\w*Query\(/,
  ] },
  { rule: 'upgrade-key-filter-trailing-undefined', scope: 'since 5.103', runtime: true, patterns: [
    /queryKey\s*:\s*\[[^\]]*undefined\s*\]/,
    /\w+\?\s*:[^)]*\)\s*(:[^=]*)?=>\s*\(?\s*\[/, // key factories with an optional param
    /queryKey\s*:\s*[\w.]+\(/,                  // filters built from a factory
  ] },
]

const SKIP = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'coverage', 'out', '.turbo'])
const SOURCE = /\.(tsx?|jsx?|mjs|cjs)$/

const [version, root = '.'] = process.argv.slice(2)
if (!/^\d+\.\d+/.test(version ?? '')) {
  console.error('Usage: node sweep.mjs <installed version, e.g. 4.44.0> [repo root]')
  process.exit(2)
}
const parse = (v) => v.split('.').map(Number)
const below = (a, b) => {
  const [x, y] = [parse(a), parse(b)]
  for (let i = 0; i < 3; i++) if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) < (y[i] ?? 0)
  return false
}
const inScope = ({ scope }) =>
  scope === '4.x' ? parse(version)[0] === 4 : below(version, scope.replace('since ', ''))

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) walk(path, out)
    else out.push(path)
  }
  return out
}

const files = walk(root)
const sources = files.filter((f) => SOURCE.test(f))
const manifests = files.filter((f) => f.endsWith('package.json'))
const text = new Map()
const read = (f) => text.get(f) ?? (text.set(f, readFileSync(f, 'utf8')), text.get(f))

const rows = ROWS.filter(inScope)
let withHits = 0
console.log(`@tanstack/react-query ${version}: ${rows.length} rows in scope\n`)
for (const row of rows) {
  const hits = []
  for (const file of row.files === 'package.json' ? manifests : sources) {
    const content = read(file)
    for (const pattern of row.patterns) {
      for (const m of content.matchAll(new RegExp(pattern.source, 'g'))) {
        const line = content.slice(0, m.index).split('\n').length
        hits.push(`${relative(root, file)}:${line}  ${m[0].split('\n')[0].trim().slice(0, 100)}`)
      }
    }
  }
  const unique = [...new Set(hits)]
  if (unique.length) withHits++
  console.log(`## ${row.rule} (${row.scope}${row.runtime ? ', runtime' : ''}): ${unique.length} hits`)
  for (const hit of unique) console.log(hit)
  console.log()
}
console.log(`${withHits} of ${rows.length} rows have hits.`)
console.log(`Runtime rules in scope (report even with 0 hits): ${rows.filter((r) => r.runtime).map((r) => r.rule).join(', ') || 'none'}`)
