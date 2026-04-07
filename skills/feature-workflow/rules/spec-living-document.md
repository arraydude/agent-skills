---
title: Spec as a Living Document
impact: HIGH
impactDescription: keeps spec accurate throughout implementation, serves as project memory
tags: spec, updates, living-document, progress
---

## Spec as a Living Document

Specs are updated throughout the implementation lifecycle. They are not write-once documents.

**Incorrect (static spec never updated):**

The spec is written once before implementation and never touched again. Phase completion isn't recorded. Problems discovered during implementation are lost.

**Correct (spec updated at each milestone):**

```markdown
# Feature Specification

**Status:** COMPLETED
**Created:** 2025-10-27
**Last Updated:** 2025-11-10
**Phase 1 Completed:** 2025-11-07
**Phase 2 Completed:** 2025-11-07
**Phase 3 Completed:** 2025-11-10
**Completion Notes:** Full migration completed. 3 PRs merged.

## Recent Updates

**2025-11-10 - Phase 3 Completed**
- Cleanup phase finished
- Deleted 4 deprecated files
- Build verified: 13.63s, 7760 modules

**2025-11-08 - CRITICAL ISSUE DISCOVERED**
- Build broken due to circular import in shared types
- Resolution: Moved type definitions to dedicated file
- Updated Phase 3 scope to include this fix

**2025-11-07 - Phase 2 Completed**
- All 11 components migrated to V2 hooks
- No regressions found in manual testing
```

**When to update the spec:**
- After each phase completes: add completion report section
- When problems are discovered: add to blockers/issues section
- When decisions change: update architecture section with date and rationale
- When metrics are measured: update metrics table with actual values
- Never delete history -- mark old plans as superseded, not removed
