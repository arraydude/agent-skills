---
title: Write Completion Reports Per Phase
impact: HIGH
impactDescription: documents what was actually done vs planned, captures learnings
tags: tracking, completion, report, retrospective
---

## Write Completion Reports Per Phase

When a phase completes, add a completion report section to the spec. This captures what actually happened vs what was planned.

**Incorrect (no record of completion):**

Phase completes, checkboxes are ticked, but no summary of what was learned, what changed, or what the actual effort was.

**Correct (structured completion report):**

```markdown
## Phase 2 Completion Report

**Completion Date:** 2025-01-22
**Status:** SUCCESSFUL
**Actual Effort:** ~3 hours

### Summary
Migrated all 8 components from V1 to V2 sender hooks.
One unexpected issue: SenderSelect had a hidden dependency
on the polling behavior for live updates.

### Key Achievements
- 8 components migrated to V2 hooks
- Eliminated ReloadToken anti-pattern in SenderList
- Added proper error boundaries to SenderForm

### Files Changed
- Created: 0 new files
- Updated: 8 existing files
- Deleted: 0 files (deferred to Phase 3)

### Issues Encountered
- SenderSelect relied on 30s polling for live updates.
  Resolution: Added WebSocket invalidation in Phase 3 scope.

### Build/Test Results
Build: 14.2s, 0 errors, 0 warnings
Tests: 42 passed, 0 failed
```

**When to write completion reports:**
- After every phase that completes
- After bug fixes discovered during implementation
- At final completion with overall summary

**What to capture:**
- Actual effort vs estimated
- Unexpected issues and their resolutions
- Files created/modified/deleted
- Build and test results
- Anything that would be done differently
