---
title: Keep PRs Focused With Clear Scope Documentation
impact: HIGH
impactDescription: enables efficient code review and reduces review fatigue
tags: pr, scope, review, documentation
---

## Keep PRs Focused With Clear Scope Documentation

PR descriptions should make the reviewer's job easy by explaining scope, rationale, and testing.

**Incorrect (minimal PR description):**

```markdown
## Description
Updated some files for the migration.
```

**Correct (structured PR description):**

```markdown
## Summary
- Migrated 8 sender components from V1 to V2 React Query hooks
- Eliminated ReloadToken polling pattern in SenderList
- Added error boundaries to SenderForm

## Changes
| Action | Files | Details |
|--------|-------|---------|
| Updated | 8 components | Swapped V1 imports to V2 |
| Updated | 1 barrel export | Added new V2 re-exports |

## Metrics Impact
| Metric | Before | After |
|--------|--------|-------|
| API calls/session | 5 | 1 |
| Polling requests/day | 2880 | 0 |

## Testing
- [x] Manual: Verified sender CRUD operations
- [x] Manual: Confirmed cache invalidation after create/update/delete
- [x] Build: No errors or warnings
- [ ] Automated: Tests updated in Phase 4 PR

## Related
- Spec: `packages/autopilot/.claude/SENDER_MIGRATION_SPEC.md`
- Phase 1 PR: #142
```

**Scope rules:**
- Never mix unrelated changes in a single PR
- Bug fixes found during migration get separate PRs unless trivially small
- Configuration-only changes (tsconfig, lint, build) can be their own PR
- Link to the spec document and prior phase PRs
