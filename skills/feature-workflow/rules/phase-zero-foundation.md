---
title: Phase 0 is Always Foundation Work
impact: CRITICAL
impactDescription: ensures infrastructure is in place before feature work begins
tags: phase, foundation, infrastructure, setup
---

## Phase 0 is Always Foundation Work

Phase 0 handles infrastructure, setup, and cleanup that later phases depend on. It never includes feature logic.

**Incorrect (starting with feature implementation):**

```markdown
## Phase 1: Implement Sender Migration
- [ ] Create V2 hook types
- [ ] Create V2 query keys
- [ ] Migrate SenderList component
- [ ] Migrate SenderForm component
- [ ] Delete old sender.ts
```

Mixes foundation (types, keys) with feature work (component migration) and cleanup (deletion) in a single phase.

**Correct (dedicated foundation phase):**

```markdown
## Phase 0: Foundation
- [ ] Delete 3 unused hooks identified in analysis (useOldSender, useLegacyList, useDeprecatedStats)
- [ ] Create shared type definitions in `types/sender.types.ts`
- [ ] Create query key factory in `keys/senderKeys.ts`
- [ ] Backend optimization: hardcode 'custom' type in SettingsController.getAllSenders
- [ ] Update barrel exports in `api/v2/index.ts`

## Phase 1: Core V2 Structure
- [ ] Create query hooks (useGetSenders, useGetSender)
- [ ] Create mutation hooks (useCreateSender, useUpdateSender, useDeleteSender)
...
```

**Phase 0 typically includes:**
- Deleting unused code identified during current state analysis
- Creating shared type definitions and interfaces
- Setting up key factories or shared utilities
- Backend optimizations that simplify frontend work
- Configuration changes (build, lint, test config)
- File structure creation (directories, barrel exports)

Phase 0 is always small, low-risk, and unblocks everything that follows.
