---
title: How to Decompose Work Into Phases
impact: CRITICAL
impactDescription: ensures each phase is independently reviewable, testable, and mergeable
tags: phase, decomposition, planning, scope
---

## How to Decompose Work Into Phases

Each phase should be a cohesive, independently shippable unit that can be reviewed in a single PR.

**Incorrect (one giant phase):**

```markdown
## Phase 1: Complete Migration
- [ ] Create types, keys, queries, mutations, utils
- [ ] Migrate all 11 components
- [ ] Delete old V1 files
- [ ] Fix all tests
```

Too large to review. If the migration breaks, you can't tell which change caused it.

**Correct (cohesive phases grouped by domain):**

```markdown
## Phase 0: Foundation (cleanup, types, keys)
## Phase 1: V2 Data Layer (queries, mutations, utils)
## Phase 2: Component Migration (swap imports, update logic)
## Phase 3: Cleanup (delete V1 files, remove legacy patterns)
## Phase 4: Testing & Verification
```

**Decomposition principles:**
1. Each phase produces a working (non-broken) state when merged
2. Phases are grouped by domain/concern, not by file type
3. Creation phases come before deletion phases
4. Each phase is reviewable in a single PR

**Common phase patterns:**

For **migrations:**
- Phase 0: Cleanup / Foundation
- Phase 1: Create V2 structure (types, keys, queries, mutations)
- Phase 2: Component migration (swap imports, update logic)
- Phase 3: Delete V1 files, remove legacy patterns
- Phase 4: Testing and verification

For **new features:**
- Phase 0: Foundation (types, shared utilities)
- Phase 1: Core implementation (data model, main logic)
- Phase 2: UI integration
- Phase 3: Polish, edge cases, testing

For **refactors:**
- Phase 1: Setup new system alongside old (hybrid state)
- Phase 2: Migrate all consumers to new system
- Phase 3: Remove old system, cleanup
