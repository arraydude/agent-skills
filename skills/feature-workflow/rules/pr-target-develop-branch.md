---
title: Feature PRs Always Target develop, Never main
impact: CRITICAL
impactDescription: targeting main bypasses release boundary, breaks GitFlow, can ship unreleased work
tags: pr, branch, develop, main, gitflow, target
---

## Feature PRs Always Target `develop`, Never `main`

Every feature, phase, and refactor PR opened from a `feature/*` branch **must** target `develop`. Only release branches and hotfixes are allowed to target `main`.

**Why:** This repo follows GitFlow. `main` represents released code; `develop` is the integration branch where features accumulate until the next release. Merging a feature directly into `main` skips the release boundary, can ship unreleased/unrelated work, and desyncs `develop` from `main`.

**Incorrect (targets main):**

```bash
# Branch off main
git checkout main
git checkout -b feature/sender-api-migration

# PR opened against main — wrong base branch
gh pr create --base main --head feature/sender-api-migration \
  --title "Sender API - Phase 1"
```

**Correct (targets develop):**

```bash
# Branch off develop
git checkout develop
git pull
git checkout -b feature/sender-api-migration

# PR opened against develop
gh pr create --base develop --head feature/sender-api-migration \
  --title "Sender API - Phase 1"
```

**Rules of thumb:**

| Branch type           | Branched from | PR targets |
| --------------------- | ------------- | ---------- |
| `feature/*`           | `develop`     | `develop`  |
| `feature/*-phase<N>`  | `develop`     | `develop`  |
| `release/YYYY-MM-DD`  | `develop`     | `main` (then back-merge to `develop`) |
| `hotfix/*`            | `main`        | `main` (then back-merge to `develop`) |

**Always pass `--base develop` explicitly when running `gh pr create`** — `gh` defaults to the repository's default branch, which is often `main`. Never rely on the default.

**Verification before opening a PR:**

```bash
# Confirm base before creating
git log --oneline develop..HEAD          # should show only your phase commits
gh pr create --base develop --draft      # draft first if unsure, then mark ready
```

If a PR is accidentally opened against `main`, change the base with `gh pr edit <num> --base develop` rather than closing and reopening.
