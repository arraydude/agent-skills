---
title: How to Iterate on Specs When Requirements Change
impact: LOW
impactDescription: handles mid-implementation changes gracefully without losing context
tags: workflow, iteration, changes, updates
---

## How to Iterate on Specs When Requirements Change

Requirements sometimes change during implementation. The spec must absorb these changes without losing history.

**Incorrect (overwriting history):**

Original architecture section is deleted and replaced with the new approach. No record of what was tried before or why it changed.

**Correct (dated updates preserving history):**

```markdown
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

**2025-11-06 - Architecture Decision Changed**
- Originally planned: Parallel V2 endpoint alongside V1
- Changed to: Replace V1 in place
- Reason: Parallel approach doubled maintenance burden
- ~~Original approach~~ superseded (see above)
```

**Iteration patterns:**
1. **Mid-phase discovery:** Add to "Current Blockers & Issues" section, update the plan
2. **Scope change:** Update Goals section, add/remove phases, update metrics table
3. **Architecture pivot:** Document the rejection and the new approach with rationale

**Update protocol:**
- Always update `Last Updated:` date in metadata
- Add dated entry to "Recent Updates" section (newest first)
- If the change affects future phases, update their descriptions
- Never delete history -- mark old plans as superseded with `~~strikethrough~~`
