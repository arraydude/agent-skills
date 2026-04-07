---
title: Branch Naming Follows GitFlow Conventions
impact: MEDIUM
impactDescription: consistent branch naming enables automation and team coordination
tags: pr, branch, gitflow, naming
---

## Branch Naming Follows GitFlow Conventions

Branch naming follows GitFlow conventions for consistency and automation.

**Incorrect (inconsistent naming):**

```
my-fix
update-stuff
new-feature-v2-final-FINAL
```

**Correct (GitFlow conventions):**

```
feature/sender-api-migration
feature/sender-api-migration-phase1
feature/sender-api-migration-phase2
feature/vite-migration-phase1
hotfix/sender-polling-fix
```

**Branch naming patterns:**
- Single-phase features: `feature/<feature-name>`
- Multi-phase features: `feature/<feature-name>-phase<N>`
- Hotfixes: `hotfix/<description>`
- Releases: `release/YYYY-MM-DD`

**Merge strategies:**
- Features to develop: **Squash & Merge** (clean history)
- Releases to main: **Merge commit** (preserves release boundary)
- Hotfixes to main: **Merge commit**, then sync to develop

**All feature branches target `develop`**, not `main`.
