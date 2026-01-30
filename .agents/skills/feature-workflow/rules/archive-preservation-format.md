---
title: Preserve Completion Notes and Learnings When Archiving
impact: MEDIUM
impactDescription: future features benefit from past learnings and decision rationale
tags: archive, learnings, preservation, knowledge
---

## Preserve Completion Notes and Learnings When Archiving

Before archiving, ensure the spec captures completion information that future work can reference.

**Incorrect (archiving without learnings):**

Spec is moved to archive with checkboxes ticked but no summary of what was learned, what went wrong, or what would be done differently.

**Correct (rich completion information preserved):**

```markdown
## Completion Summary

**Completed:** 2025-11-05
**Total Effort:** ~6 hours across 3 sessions
**PRs Merged:** 4

### Achievements
- 80% reduction in API calls (5 → 1 per session)
- Eliminated ReloadToken anti-pattern across 8 components
- Full type safety from API response to component render
- Zero regressions reported post-merge

### Key Decisions & Rationale
1. **Kept useSenderStats separate** - Dashboard uses different refresh
   cadence than CRUD operations. Merging would over-fetch.
2. **Added retry: false to mutations** - Discovered that retrying
   failed mutations caused duplicate senders in edge cases.

### Learnings for Future Migrations
- Always verify backend type safety before starting frontend migration
- External update refetch (WebSocket, AI edits) requires separate testing
- DevTools is essential for verifying cache invalidation patterns
- Phase 0 cleanup saves significant time in later phases

### What Would Be Done Differently
- Would have split Phase 2 into two PRs (8 components was too many for one review)
- Would have added automated tests earlier instead of deferring to Phase 4
```

**What to preserve:**
- Architectural decisions and their rationale
- Problems discovered during implementation not in the original spec
- Actual effort vs estimated effort
- Techniques or patterns that worked well
- Things that would be done differently next time
