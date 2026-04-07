---
title: Iterative Planning Between Claude and Developer
impact: MEDIUM
impactDescription: ensures alignment before implementation begins, reduces rework
tags: workflow, collaboration, iteration, planning
---

## Iterative Planning Between Claude and Developer

The feature workflow is collaborative, not unilateral. Claude and the developer iterate together through a defined loop.

**Incorrect (unilateral implementation):**

Claude receives a feature request, writes a complete spec, and immediately starts implementing without developer review or input on key decisions.

**Correct (collaborative iteration loop):**

```
1. Discovery     → Developer describes the feature/problem
2. Analysis      → Claude explores codebase, documents current state
3. Proposal      → Claude drafts spec with architecture and phases
4. Review        → Developer reviews, provides feedback, makes decisions
5. Refinement    → Claude updates spec based on feedback
6. Approval      → Developer confirms plan is ready
7. Implementation → Phase-by-phase execution with progress updates
8. Completion    → Archive spec and capture learnings
```

**Key decision points requiring developer input:**
- Architectural choices (e.g., "Replace existing endpoint vs create parallel one")
- Scope decisions (what is in/out of scope)
- Phase ordering priorities
- Naming conventions for new abstractions
- Whether to split into separate PRs

**Recording decisions in the spec:**

```markdown
### Architectural Decision: Replace v2/deliveries/ - CONFIRMED

User selected: "Replace v2/deliveries/" - Move current flow
hooks to v2/flows/, then use v2/deliveries/ for campaigns.

Rationale: Avoids duplicate endpoints and matches domain naming.
```

**Non-Goals sections prevent scope creep:**

```markdown
### Non-Goals
- Changing the WebSocket connection machine
- Modifying the visibleMessages cache update logic
- Changing backend WebSocket message types
- Adding new features beyond the migration scope
```
