---
title: Required Content for Each Spec Section
impact: CRITICAL
impactDescription: prevents underspecified specs that lead to implementation rework
tags: spec, content, requirements, sections
---

## Required Content for Each Spec Section

Each section must contain specific types of information. Underspecified sections lead to rework during implementation.

**Executive Summary must include:**

```markdown
## Executive Summary

### Overview
One paragraph describing what this feature/migration does and why.

### Key Metrics
| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| Hooks | 7 | 6 | -1 hook |
| API Calls/Session | 5 | 1 | **-80%** |
| Type Safety | Mixed | Full | 100% typed |

### Goals
1. Eliminate polling-based data fetching
2. Add proper cache invalidation
3. Achieve full type safety

### Why This Matters
1. Reduces server load by 80%
2. Improves user experience with instant updates
```

**Current State Analysis must include:**

```markdown
## Current State Analysis

### File Locations
- `src/api/v1/sender.ts` (142 lines)
- `src/components/SenderList.tsx` (89 lines)

### Hook Inventory
| Hook | Endpoint | Type | Components Using |
|------|----------|------|-----------------|
| useSenders | GET /senders | Query | SenderList, Settings |
| useCreateSender | POST /senders | Mutation | SenderForm |

### Problems Identified
1. **Polling every 30s** - Wastes bandwidth when data hasn't changed
   ```typescript
   // Current anti-pattern
   const { data } = useQuery('senders', fetchSenders, {
     refetchInterval: 30000, // Unnecessary polling
   });
   ```
```

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
