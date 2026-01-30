---
title: Required Spec Document Structure
impact: CRITICAL
impactDescription: ensures consistent, navigable specs that all team members can follow
tags: spec, structure, template, documentation
---

## Required Spec Document Structure

Every spec document follows a consistent structure. This ensures anyone can navigate and understand the plan regardless of feature complexity.

**Incorrect (jumping into implementation):**

```markdown
# New Feature

## Implementation

1. Create the hook
2. Add the component
3. Wire it up
```

No context, no current state analysis, no metrics, no testing strategy.

**Correct (full structured spec):**

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
Overview, key metrics table, goals, rationale.

## 2. Current State Analysis
Existing code inventory, file paths, problems with evidence.

## 3. Architecture Design
Proposed solution with diagrams, before/after comparisons.

## 4. Implementation Plan
Phased breakdown with checkbox lists per phase.

## 5. Testing Strategy
What to test per phase, manual and automated verification.

## 6. Success Criteria
Measurable, verifiable items with before/after targets.
```

The metadata block at the top provides at-a-glance project status. The numbered ToC enables quick navigation. Sections flow from understanding (current state) to planning (architecture, phases) to verification (testing, criteria).
