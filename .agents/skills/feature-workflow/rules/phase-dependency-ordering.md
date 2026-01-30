---
title: Order Phases by Dependency Chain
impact: HIGH
impactDescription: prevents blocked work and ensures each phase can be completed independently
tags: phase, dependencies, ordering, planning
---

## Order Phases by Dependency Chain

Phases must be ordered so that each phase's prerequisites are satisfied by earlier phases.

**Incorrect (out-of-order dependencies):**

```markdown
Phase 1: Migrate components to use V2 hooks
Phase 2: Create V2 hook types and key factories
Phase 3: Backend API changes
```

Phase 1 needs V2 hooks that don't exist yet. Phase 2 needs backend changes that haven't been made.

**Correct (dependency-ordered):**

```markdown
Phase 0: Backend API changes (unblocks frontend)
Phase 1: Create V2 types and key factories (unblocks hooks)
Phase 2: Create V2 query and mutation hooks (unblocks components)
Phase 3: Migrate components to V2 hooks
Phase 4: Delete V1 files and legacy patterns
Phase 5: Testing and verification
```

**Dependency chain order:**
1. Backend changes -- always first, unblocks frontend
2. Shared types and interfaces
3. Utility/helper creation
4. Core data layer (queries, mutations, keys)
5. Component migration/creation
6. Integration and wiring
7. Cleanup and deletion of old code
8. Testing and verification

**Key rules:**
- Types before implementations that use them
- Backend before frontend (when both change)
- Shared utilities before consumers
- Creation before deletion (create V2 before deleting V1)
- Never delete old code in the same phase as creating new code
