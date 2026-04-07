---
title: Place Specs Under the Relevant Package .claude/ Directory
impact: MEDIUM
impactDescription: specs are discoverable and associated with their package context
tags: workflow, placement, directory, organization
---

## Place Specs Under the Relevant Package .claude/ Directory

Specs live in the `.claude/` directory of the package they primarily affect.

**Incorrect (specs scattered randomly):**

```
/docs/specs/sender-migration.md
/notes/migration-plan.txt
/TODO.md
```

**Correct (organized by package):**

```
packages/autopilot/.claude/
  V1_API_MIGRATION_SPEC.md          # Active spec
  archive/
    SENDER_MIGRATION_SPEC.md        # Archived
    DELIVERY_MIGRATION_SPEC.md      # Archived

packages/design-system/.claude/
  TEXT_EDITOR_SPEC.md               # Living reference doc

packages/backend/.claude/
  API_RESTRUCTURE_SPEC.md           # Active spec
```

**Placement rules:**
- Autopilot feature specs → `packages/autopilot/.claude/`
- Design system specs → `packages/design-system/.claude/`
- Backend specs → `packages/backend/.claude/`
- Cross-package specs → place in the most affected package, reference others

**File naming conventions:**
- All uppercase with underscores: `FEATURE_NAME_SPEC.md`
- Include `_SPEC` suffix for specification documents
- Learning/reference docs can omit `_SPEC`: `REACT_QUERY_LEARNING.md`
- Use descriptive names that indicate the feature domain
