---
title: Use Consistent Status Indicators
impact: HIGH
impactDescription: enables quick progress scanning across specs
tags: tracking, status, progress, indicators
---

## Use Consistent Status Indicators

All specs use a consistent set of status indicators for tracking progress at both the document and task level.

**Incorrect (inconsistent or missing status):**

```markdown
# Feature Spec

Done with most of it. Still need to do some stuff.

## Tasks
- Created the hook
- Need to migrate components
- Testing TBD
```

No structured status. Can't quickly scan progress.

**Correct (structured status indicators):**

**Document-level status (metadata block):**

```markdown
**Status:** IN PROGRESS - Phase 2
**Created:** 2025-01-15
**Last Updated:** 2025-01-22
```

Valid statuses: `READY FOR IMPLEMENTATION`, `IN PROGRESS - Phase N`, `COMPLETED`

**Phase-level progress tracker:**

```markdown
### Progress Tracker

- [x] **Phase 0: Foundation** - COMPLETED (2025-01-16)
- [x] **Phase 1: V2 Structure** - COMPLETED (2025-01-18)
- [ ] **Phase 2: Component Migration** - IN PROGRESS
- [ ] **Phase 3: Cleanup**
- [ ] **Phase 4: Testing**
```

**Task-level checklists within phases:**

```markdown
## Phase 2: Component Migration

- [x] Migrate SenderList to V2 hooks
- [x] Migrate SenderForm to V2 hooks
- [ ] Migrate SenderDetail to V2 hooks
- [ ] Migrate SenderSelect to V2 hooks
- [ ] Update barrel exports
```

**Roadmap tables with complexity:**

```markdown
| Phase | Feature | Complexity | Status |
|-------|---------|-----------|--------|
| 0 | Cleanup | LOW | COMPLETED |
| 1 | Account API | MEDIUM | COMPLETED |
| 2 | Core Features | HIGH | IN PROGRESS |
| 3 | Delivery | MEDIUM | PENDING |
```
