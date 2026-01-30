---
title: One PR Per Phase for Reviewability
impact: HIGH
impactDescription: keeps PRs focused and reviewable, reduces merge conflict risk
tags: pr, review, phase, strategy
---

## One PR Per Phase for Reviewability

Each implementation phase gets its own PR. This keeps reviews focused and reduces merge conflict risk.

**Incorrect (one giant PR):**

```markdown
PR: "V1 to V2 Migration"
- 47 files changed
- Creates V2 types, keys, queries, mutations
- Migrates 11 components
- Deletes V1 files
- Fixes 3 bugs found during migration
```

Too large to review effectively. Reviewer fatigue leads to rubber-stamping. If something breaks, hard to bisect.

**Correct (one PR per phase):**

```markdown
PR 1: "Sender API - Phase 0: Foundation cleanup"
- 4 files deleted (unused hooks)
- 2 files created (types, key factory)

PR 2: "Sender API - Phase 1: V2 data layer"
- 6 files created (queries, mutations, utils, index)
- 0 existing files modified

PR 3: "Sender API - Phase 2: Component migration"
- 8 files updated (component imports swapped)
- 0 files created or deleted

PR 4: "Sender API - Phase 3: V1 cleanup"
- 3 files deleted (old V1 hooks)
- 2 files updated (removed legacy imports)
```

**When to split a phase into multiple PRs:**
- Phase affects >20 files
- Phase crosses package boundaries (backend + frontend)
- Independent sub-domains within the phase (e.g., Subscribers and Segments are separate domains)

**PR title format:**
`"<Feature> - Phase N: <Description>"`
