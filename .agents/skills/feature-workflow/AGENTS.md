# Feature Workflow Guide - Complete Reference

**Version:** 1.0.0
**Author:** arraydude
**Note:** This document is optimized for AI agent consumption. For quick reference, see `SKILL.md`.

---

## Abstract

This guide covers the complete workflow for planning, specifying, implementing, and archiving features. It codifies a battle-tested process derived from 18+ completed feature specs, covering spec creation, phased implementation, progress tracking, PR strategy, and archival. Contains 18 rules across 6 categories.

---

## Table of Contents

1. [Spec Structure & Content](#1-spec-structure--content) -- **CRITICAL**
   - [1.1 Required Spec Document Structure](#11-required-spec-document-structure)
   - [1.2 Required Content for Each Spec Section](#12-required-content-for-each-spec-section)
   - [1.3 Always Start With Current State Analysis](#13-always-start-with-current-state-analysis)
   - [1.4 Spec as a Living Document](#14-spec-as-a-living-document)
2. [Phase Design](#2-phase-design) -- **CRITICAL**
   - [2.1 Phase 0 is Always Foundation Work](#21-phase-0-is-always-foundation-work)
   - [2.2 How to Decompose Work Into Phases](#22-how-to-decompose-work-into-phases)
   - [2.3 Order Phases by Dependency Chain](#23-order-phases-by-dependency-chain)
3. [Progress Tracking](#3-progress-tracking) -- **HIGH**
   - [3.1 Use Consistent Status Indicators](#31-use-consistent-status-indicators)
   - [3.2 Write Completion Reports Per Phase](#32-write-completion-reports-per-phase)
   - [3.3 Include Before/After Metrics Tables](#33-include-beforeafter-metrics-tables)
4. [PR Strategy](#4-pr-strategy) -- **HIGH**
   - [4.1 One PR Per Phase for Reviewability](#41-one-pr-per-phase-for-reviewability)
   - [4.2 Branch Naming Follows GitFlow Conventions](#42-branch-naming-follows-gitflow-conventions)
   - [4.3 Keep PRs Focused With Clear Scope Documentation](#43-keep-prs-focused-with-clear-scope-documentation)
5. [Archival](#5-archival) -- **MEDIUM**
   - [5.1 When and How to Archive Completed Specs](#51-when-and-how-to-archive-completed-specs)
   - [5.2 Preserve Completion Notes and Learnings](#52-preserve-completion-notes-and-learnings)
6. [Workflow Collaboration](#6-workflow-collaboration) -- **MEDIUM**
   - [6.1 Iterative Planning Between AI and Developer](#61-iterative-planning-between-ai-and-developer)
   - [6.2 Place Specs Under the Relevant Package .claude/ Directory](#62-place-specs-under-the-relevant-package-claude-directory)
   - [6.3 How to Iterate on Specs When Requirements Change](#63-how-to-iterate-on-specs-when-requirements-change)

---

## 1. Spec Structure & Content

### 1.1 Required Spec Document Structure

**Impact:** CRITICAL

Every spec document follows a consistent structure with these required elements in order:

1. **Title** - `# Feature Name Specification`
2. **Metadata block** - Status, Created, Last Updated, Purpose, Priority, Complexity
3. **Table of Contents** - Numbered, linked
4. **Executive Summary** - Overview, Key Metrics table, Goals, Rationale
5. **Current State Analysis** - Existing code inventory, file paths, problems with evidence
6. **Architecture Design** - Proposed solution with diagrams, before/after comparisons
7. **Implementation Plan** - Phased breakdown with checkbox lists
8. **Testing Strategy** - What to test per phase, manual and automated
9. **Success Criteria** - Measurable, verifiable items

**Incorrect:**

```markdown
# New Feature

## Implementation
1. Create the hook
2. Add the component
3. Wire it up
```

**Correct:**

```markdown
# Feature Name Specification

**Status:** IN PROGRESS - Phase 1
**Created:** 2025-01-15
**Last Updated:** 2025-01-20
**Purpose:** Brief one-liner
**Priority:** HIGH
**Complexity:** MEDIUM

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Architecture Design](#architecture-design)
4. [Implementation Plan](#implementation-plan)
5. [Testing Strategy](#testing-strategy)
6. [Success Criteria](#success-criteria)

## 1. Executive Summary
...
## 2. Current State Analysis
...
```

---

### 1.2 Required Content for Each Spec Section

**Impact:** CRITICAL

Each section must contain specific types of information to prevent underspecification.

**Executive Summary must include:**
- One-paragraph overview
- Key Metrics table: Metric | Current | Target | Improvement
- Numbered goals (3-5)
- "Why This Matters" rationale

**Current State Analysis must include:**
- File location paths with line counts
- Hook/component inventory table: Name | Endpoint | Type | Used By
- Problems Identified with numbered descriptions and code snippets

**Architecture Design must include:**
- Before/after comparison table
- Type definitions or interface code blocks
- Decision rationale for key choices

**Implementation Plan must include:**
- Phased breakdown with `[ ]`/`[x]` checkbox lists
- File creation/modification/deletion inventory per phase

**Testing Strategy must include:**
- What to test per phase
- How to verify (manual steps, automated tests)
- Regression concerns

**Success Criteria must include:**
- Measurable items with specific numbers
- Before/after metric targets

---

### 1.3 Always Start With Current State Analysis

**Impact:** CRITICAL

Before proposing any changes, thoroughly document what exists today. This prevents building on incorrect assumptions.

**Required analysis steps:**
1. Identify all affected files with paths and line counts
2. Map every hook/component with its consumers
3. Document current behavior with code snippets
4. Identify specific problems with evidence (show the anti-pattern code)
5. Note dependencies (what uses what, what will break if changed)

**Incorrect:**

```markdown
## Architecture Design
We'll create a new V2 hook system that replaces everything.
```

**Correct:**

```markdown
## Current State Analysis

### Existing Implementation
The sender API is implemented across 3 files totaling 342 lines:
- `src/api/v1/sender.ts` (142 lines) - 7 hooks
- `src/hooks/useSenderPolling.ts` (89 lines) - polling wrapper
- `src/utils/senderTransforms.ts` (111 lines) - data transforms

### Hook Inventory
| Hook | Endpoint | Type | Used By |
|------|----------|------|---------|
| useSenders | GET /api/senders | Query + Polling | SenderList, SenderSelect |
| useCreateSender | POST /api/senders | Mutation | SenderForm |

### Problems Identified
1. **Global polling** - useSenders polls every 30s even when tab is hidden
   ```typescript
   refetchInterval: 30000  // 2880 unnecessary requests/day
   ```
```

---

### 1.4 Spec as a Living Document

**Impact:** HIGH

Specs are updated throughout the implementation lifecycle. They are not write-once documents.

**When to update:**
- After each phase completes: add completion report section
- When problems are discovered: add to blockers/issues section
- When decisions change: update architecture section with date and rationale
- When metrics are measured: update metrics table with actual values

**Correct update pattern:**

```markdown
**Status:** COMPLETED
**Created:** 2025-10-27
**Last Updated:** 2025-11-10
**Phase 1 Completed:** 2025-11-07
**Phase 2 Completed:** 2025-11-07
**Phase 3 Completed:** 2025-11-10

## Recent Updates

**2025-11-10 - Phase 3 Completed**
- Cleanup phase finished, deleted 4 deprecated files

**2025-11-08 - CRITICAL ISSUE DISCOVERED**
- Build broken due to circular import
- Resolution: Moved type definitions to dedicated file
```

Never delete history -- mark old plans as superseded, not removed.

---

## 2. Phase Design

### 2.1 Phase 0 is Always Foundation Work

**Impact:** CRITICAL

Phase 0 handles infrastructure, setup, and cleanup that later phases depend on. It never includes feature logic.

**Phase 0 typically includes:**
- Deleting unused code identified during current state analysis
- Creating shared type definitions and interfaces
- Setting up key factories or shared utilities
- Backend optimizations that simplify frontend work
- Configuration changes (build, lint, test config)
- File structure creation (directories, barrel exports)

**Incorrect:**

```markdown
## Phase 1: Implement Sender Migration
- [ ] Create V2 hook types
- [ ] Create V2 query keys
- [ ] Migrate SenderList component
- [ ] Delete old sender.ts
```

**Correct:**

```markdown
## Phase 0: Foundation
- [ ] Delete 3 unused hooks identified in analysis
- [ ] Create shared type definitions in types/sender.types.ts
- [ ] Create query key factory in keys/senderKeys.ts
- [ ] Backend optimization: hardcode 'custom' type in controller

## Phase 1: Core V2 Structure
- [ ] Create query hooks
- [ ] Create mutation hooks
```

---

### 2.2 How to Decompose Work Into Phases

**Impact:** CRITICAL

Each phase should be a cohesive, independently shippable unit that can be reviewed in a single PR.

**Decomposition principles:**
1. Each phase produces a working (non-broken) state when merged
2. Phases are grouped by domain/concern, not by file type
3. Creation phases come before deletion phases
4. Each phase is reviewable in a single PR

**Common phase patterns:**

For **migrations:**
- Phase 0: Cleanup / Foundation
- Phase 1: Create V2 structure (types, keys, queries, mutations)
- Phase 2: Component migration (swap imports, update logic)
- Phase 3: Delete V1 files, remove legacy patterns
- Phase 4: Testing and verification

For **new features:**
- Phase 0: Foundation (types, shared utilities)
- Phase 1: Core implementation (data model, main logic)
- Phase 2: UI integration
- Phase 3: Polish, edge cases, testing

For **refactors:**
- Phase 1: Setup new system alongside old (hybrid state)
- Phase 2: Migrate all consumers to new system
- Phase 3: Remove old system, cleanup

---

### 2.3 Order Phases by Dependency Chain

**Impact:** HIGH

Phases must be ordered so each phase's prerequisites are satisfied by earlier phases.

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

---

## 3. Progress Tracking

### 3.1 Use Consistent Status Indicators

**Impact:** HIGH

**Document-level status (metadata block):**
- `READY FOR IMPLEMENTATION` - Spec finalized, work not started
- `IN PROGRESS - Phase N` - Currently being worked on
- `COMPLETED` - All phases done

**Phase-level progress tracker:**

```markdown
### Progress Tracker
- [x] **Phase 0: Foundation** - COMPLETED (2025-01-16)
- [x] **Phase 1: V2 Structure** - COMPLETED (2025-01-18)
- [ ] **Phase 2: Component Migration** - IN PROGRESS
- [ ] **Phase 3: Cleanup**
```

**Task-level checklists within phases:**

```markdown
## Phase 2: Component Migration
- [x] Migrate SenderList to V2 hooks
- [x] Migrate SenderForm to V2 hooks
- [ ] Migrate SenderDetail to V2 hooks
```

---

### 3.2 Write Completion Reports Per Phase

**Impact:** HIGH

When a phase completes, add a completion report:

```markdown
## Phase 2 Completion Report

**Completion Date:** 2025-01-22
**Status:** SUCCESSFUL
**Actual Effort:** ~3 hours

### Summary
Migrated all 8 components from V1 to V2 sender hooks.

### Key Achievements
- 8 components migrated
- Eliminated ReloadToken anti-pattern
- Added proper error boundaries

### Files Changed
- Created: 0 | Updated: 8 | Deleted: 0

### Issues Encountered
- SenderSelect relied on polling for live updates.
  Resolution: Added WebSocket invalidation to Phase 3 scope.
```

---

### 3.3 Include Before/After Metrics Tables

**Impact:** MEDIUM

Every spec should include a metrics table. Update with actual values after implementation.

```markdown
| Metric | Current | Target | Actual | Improvement |
|--------|---------|--------|--------|-------------|
| Hooks | 7 | 6 | 6 | -1 hook |
| API Calls/Session | 5 | 1 | 1 | **-80%** |
| Type Safety | Mixed | Full | Full | 100% typed |
| Polling Requests/Day | 2880 | 0 | 0 | **-100%** |
```

**Common metrics:** Hook count, network requests, cache scope, type safety, files changed, bundle size, build time.

---

## 4. PR Strategy

### 4.1 One PR Per Phase for Reviewability

**Impact:** HIGH

Each phase gets its own PR. This keeps reviews focused and merge conflicts manageable.

**PR title format:** `"<Feature> - Phase N: <Description>"`

**When to split a phase into multiple PRs:**
- Phase affects >20 files
- Phase crosses package boundaries
- Independent sub-domains within the phase

**Incorrect:** Single PR with 47 files spanning types, components, and cleanup.

**Correct:**
- PR 1: "Sender API - Phase 0: Foundation cleanup" (6 files)
- PR 2: "Sender API - Phase 1: V2 data layer" (6 files)
- PR 3: "Sender API - Phase 2: Component migration" (8 files)
- PR 4: "Sender API - Phase 3: V1 cleanup" (5 files)

---

### 4.2 Branch Naming Follows GitFlow Conventions

**Impact:** MEDIUM

**Branch patterns:**
- Single-phase features: `feature/<feature-name>`
- Multi-phase features: `feature/<feature-name>-phase<N>`
- Hotfixes: `hotfix/<description>`
- Releases: `release/YYYY-MM-DD`

**Merge strategies:**
- Features to develop: **Squash & Merge**
- Releases to main: **Merge commit**
- Hotfixes to main: **Merge commit**, then sync to develop

---

### 4.3 Keep PRs Focused With Clear Scope Documentation

**Impact:** HIGH

**PR description template:**

```markdown
## Summary
- What this PR does (1-3 bullet points)

## Changes
| Action | Files | Details |
|--------|-------|---------|
| Created | 6 | V2 query/mutation hooks |
| Updated | 1 | Barrel export |

## Metrics Impact
| Metric | Before | After |
|--------|--------|-------|
| API calls | 5 | 1 |

## Testing
- [x] Manual: Verified CRUD operations
- [x] Build: No errors

## Related
- Spec: `packages/autopilot/.claude/SENDER_MIGRATION_SPEC.md`
- Phase 1 PR: #142
```

**Scope rules:**
- Never mix unrelated changes
- Bug fixes found during migration get separate PRs
- Link to spec document and prior phase PRs

---

## 5. Archival

### 5.1 When and How to Archive Completed Specs

**Impact:** MEDIUM

**Archive criteria (ALL must be met):**
1. All phases marked as completed
2. All PRs merged
3. Completion summary written
4. No remaining TODOs or blockers

**Archive location:** `packages/<package-name>/.claude/archive/`

**File naming:** Keep `UPPERCASE_NAME_SPEC.md`. Optionally append `_COMPLETED_YYYY-MM-DD` for major work.

**What NOT to archive:**
- Living reference documents still actively consulted
- Partially complete specs

---

### 5.2 Preserve Completion Notes and Learnings

**Impact:** MEDIUM

Before archiving, ensure the spec captures:

```markdown
## Completion Summary

**Completed:** 2025-11-05
**Total Effort:** ~6 hours across 3 sessions
**PRs Merged:** 4

### Achievements
- 80% reduction in API calls
- Full type safety from API to component

### Key Decisions & Rationale
1. Kept useSenderStats separate - different refresh cadence
2. Added retry: false to mutations - prevented duplicate creates

### Learnings for Future Work
- Always verify backend type safety before frontend migration
- DevTools is essential for verifying cache invalidation
- Phase 0 cleanup saves significant time in later phases

### What Would Be Done Differently
- Would split Phase 2 into two PRs (8 components too many for one review)
```

---

## 6. Workflow Collaboration

### 6.1 Iterative Planning Between AI and Developer

**Impact:** MEDIUM

The workflow is collaborative through a defined loop:

```
1. Discovery     → Developer describes the feature/problem
2. Analysis      → AI explores codebase, documents current state
3. Proposal      → AI drafts spec with architecture and phases
4. Review        → Developer reviews, provides feedback
5. Refinement    → AI updates spec based on feedback
6. Approval      → Developer confirms plan
7. Implementation → Phase-by-phase with per-phase PRs
8. Completion    → Archive spec and capture learnings
```

**Key decision points requiring developer input:**
- Architectural choices
- Scope decisions (in/out)
- Phase ordering priorities
- Naming conventions

**Record decisions explicitly:**

```markdown
### Architectural Decision: Replace v2/deliveries/ - CONFIRMED
User selected: "Replace v2/deliveries/"
Rationale: Avoids duplicate endpoints and matches domain naming.
```

**Prevent scope creep with Non-Goals:**

```markdown
### Non-Goals
- Changing the WebSocket connection machine
- Adding features beyond the migration scope
```

---

### 6.2 Place Specs Under the Relevant Package .claude/ Directory

**Impact:** MEDIUM

**Placement rules:**
- Specs go in `packages/<pkg>/.claude/`
- Archived specs go in `packages/<pkg>/.claude/archive/`
- Cross-package specs go in the most affected package
- File naming: `UPPERCASE_NAME_SPEC.md`

---

### 6.3 How to Iterate on Specs When Requirements Change

**Impact:** LOW

**Iteration patterns:**
1. **Mid-phase discovery:** Add to blockers section, update plan
2. **Scope change:** Update Goals, add/remove phases, update metrics
3. **Architecture pivot:** Document rejection and new approach with rationale

**Update protocol:**
- Always update `Last Updated:` date
- Add dated entry to "Recent Updates" (newest first)
- Update future phase descriptions if affected
- Never delete history -- use `~~strikethrough~~` for superseded content
