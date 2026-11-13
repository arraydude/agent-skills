---
title: Keep TypeScript and React Within the Supported Range
impact: MEDIUM
impactDescription: v5 minors can break type-checking on older TypeScript
tags: upgrade, v5, typescript, react, peerDependencies, versions
versions: v5
since: "5.100"
---

## Keep TypeScript and React Within the Supported Range

v5 launched with a TypeScript 4.7 floor, but it now follows DefinitelyTyped's two-year support window: **TypeScript 5.7+**. Since 5.100.13 the types use TypeScript's built-in `NoInfer`, which needs **TS ≥ 5.4**. React must satisfy the peer range **`^18 || ^19`**. Type changes usually ship as patch releases, so the docs recommend pinning an exact version and upgrading on purpose.

**Incorrect (old TS, floating range):**

```json
{
  "dependencies": { "@tanstack/react-query": "^5.0.0", "react": "^17.0.2" },
  "devDependencies": { "typescript": "~5.3.0" }
}
```

**Correct:**

```json
{
  "dependencies": { "@tanstack/react-query": "5.107.1", "react": "^19.0.0" },
  "devDependencies": { "typescript": "^5.7.0" }
}
```

- React 18 is the hard floor for all of v5 (`useSyncExternalStore`). React 19 is supported since 5.39.
- Type changes are treated as non-breaking and can land in any release (for example the 5.102 `NoInfer` revert on `useQuery` return types). Re-run the type check on every bump.
- Browser targets: Chrome/Edge 91, Firefox 90, Safari/iOS 15, Opera 77. Transpile `node_modules` yourself for older browsers.

Reference: [TypeScript](https://tanstack.com/query/v5/docs/framework/react/typescript) · [Installation](https://tanstack.com/query/v5/docs/framework/react/installation#requirements)
