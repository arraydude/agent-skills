---
name: react-query-migrate-v5
description: Upgrade a repo's TanStack Query for React to the latest v5 release, from v4 or from an older v5 minor, fixing every breaking change and deprecation.
disable-model-invocation: true
license: MIT
metadata:
  author: arraydude
  version: "1.0.0"
---

# Migrate React Query to v5

Carry one repo's `@tanstack/react-query` to the latest 5.x release and leave it
compiling, linted and tested. The sibling
[`react-query-best-practices`](../react-query-best-practices/SKILL.md) skill
holds every fix as a rule with before → after code: `migration-*` rules cover
v4 → v5, `upgrade-*` rules cover changes inside v5. This skill sequences them.

Argument: an optional target version. Default: the latest 5.x on npm
(`npm view @tanstack/react-query@5 version`).

## 1. Detect

- **Installed version:** the lockfile entry for `@tanstack/react-query`, not the
  `package.json` range. Only the v3 package `react-query` present → report that
  v3 → v4 comes first and stop.
- **Path:** from 4.x, run every step. From 5.x, skip step 4, and step 5 covers
  only the `upgrade-*` rules (plus `query-imperative-query-method`) whose
  `since` is above the installed version.
- **Floors** (`upgrade-toolchain-floors`, `migration-misc-breaking-changes`):
  React `^18 || ^19`, TypeScript and browser minimums. A floor that fails →
  report it and stop: raising React or TypeScript is the human's call.

Done when the from/to versions and the path are written down and every floor
passes.

## 2. Baseline

Start a branch from a clean tree. Run the repo's typecheck, lint and tests
(commands from `AGENTS.md` / `CLAUDE.md`, else `package.json` scripts) and save
the failures to `.context/react-query-migrate/baseline.txt` as pre-existing.

Done when the baseline file exists.

## 3. Bump packages

Bump every TanStack Query package the repo uses (`react-query`,
`react-query-devtools`, `eslint-plugin-query`, the persist client and
persisters) to the target version in one install.

Done when the lockfile resolves each of them to the target.

## 4. Codemods (from 4.x only)

Run `remove-overloads` first, since it normalizes call shapes for the rest,
then `rename-properties`, `is-loading`, `keep-previous-data` and
`rename-hydrate`, each followed by the repo's formatter:

```bash
npx jscodeshift@latest ./src --extensions=ts,tsx --parser=tsx \
  --transform=./node_modules/@tanstack/react-query/build/codemods/v5/<name>/<name>.cjs
```

Releases before 5.104 keep the codemods under `build/codemods/src/v5/`: use
that path when the first one is missing. Use `--extensions=js,jsx` without
`--parser=tsx` for JavaScript sources. Every
usage a codemod logs as skipped goes on the step 5 worklist with its file and
line.

Done when all five ran and their skipped usages are on the worklist.

## 5. Sweep

For each rule in scope, run its search from [sweep.md](sweep.md), read the
rule, and apply its fix to every hit and worklist entry.

Done when every in-scope search returns no hits, or each remaining hit is
listed with the reason it stays.

## 6. Validate

Re-run typecheck, lint and tests. Any failure missing from the baseline goes
back through step 5.

Done when the only failures left are the baseline ones.

## 7. Report

- From → to versions, the codemods run, and the files changed per rule.
- **Behaviour to check by hand.** Some changes compile cleanly and still shift
  runtime behaviour. List each in-scope rule marked `runtime` in
  [sweep.md](sweep.md) with the files it touches.
- Remaining hits with their reasons, and baseline failures left as found.
