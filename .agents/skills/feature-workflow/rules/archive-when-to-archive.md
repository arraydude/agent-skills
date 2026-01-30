---
title: When and How to Archive Completed Specs
impact: MEDIUM
impactDescription: keeps active directory clean while preserving institutional knowledge
tags: archive, completion, knowledge, organization
---

## When and How to Archive Completed Specs

Specs are moved to archive after all phases are complete and merged. This keeps the active `.claude/` directory clean while preserving knowledge.

**Incorrect (specs accumulate forever):**

Active directory has 15 completed specs mixed with 2 active ones. Hard to find what's currently in progress.

**Correct (clean active directory, organized archive):**

```
packages/autopilot/.claude/
  V1_API_MIGRATION_SPEC.md          # Active (Phase 5 remaining)
  archive/
    SENDER_MIGRATION_SPEC.md        # Completed
    DELIVERY_MIGRATION_SPEC.md      # Completed
    NEXTJS_TO_VITE_MIGRATION_SPEC_COMPLETED_2025-11-10.md  # Completed
```

**Archive criteria (ALL must be met):**
1. All phases marked as completed in the progress tracker
2. All PRs merged to develop
3. Completion summary written at the top of the spec
4. No remaining TODO items or blockers

**Archive location:**
`packages/<package-name>/.claude/archive/`

**File naming:**
- Keep the original `UPPERCASE_NAME_SPEC.md` format
- Optionally append completion date for major work: `_COMPLETED_YYYY-MM-DD`

**What NOT to archive:**
- Living reference documents that serve as ongoing architectural documentation
- Specs that are partially complete
- Learning documents that are actively referenced (these can stay in archive but are a different category)
