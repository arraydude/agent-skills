---
title: Always Start With Current State Analysis
impact: CRITICAL
impactDescription: prevents building on incorrect assumptions about existing code
tags: spec, analysis, current-state, inventory
---

## Always Start With Current State Analysis

Before proposing any changes, thoroughly document what exists today. This is the most important section for preventing rework.

**Incorrect (proposing changes without understanding current state):**

```markdown
## Architecture Design

We'll create a new V2 hook system that replaces everything.

### New Hooks
- useGetSenders()
- useCreateSender()
```

No inventory of existing code. No file paths. No understanding of what currently exists or what depends on it.

**Correct (thorough current state analysis):**

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
| useSenders | GET /api/senders | Query + Polling | SenderList, SenderSelect, Settings |
| useSender | GET /api/senders/:id | Query | SenderDetail, SenderEdit |
| useCreateSender | POST /api/senders | Mutation | SenderForm |
| useUpdateSender | PUT /api/senders/:id | Mutation | SenderEdit |
| useDeleteSender | DELETE /api/senders/:id | Mutation | SenderList |
| useVerifySender | POST /api/senders/:id/verify | Mutation | SenderDetail |
| useSenderStats | GET /api/senders/stats | Query | Dashboard |

### Problems Identified
1. **Global polling** - useSenders polls every 30s even when tab is hidden
   ```typescript
   refetchInterval: 30000  // 2880 unnecessary requests/day
   ```
2. **No cache invalidation** - Mutations don't invalidate related queries
3. **Mixed types** - API responses cast as `any` in 4 locations
```

**Required analysis steps:**
1. Identify all affected files with paths and line counts
2. Map every hook/component with its consumers
3. Document current behavior with code snippets
4. Identify specific problems with evidence (show the anti-pattern code)
5. Note dependencies (what uses what, what will break if changed)
