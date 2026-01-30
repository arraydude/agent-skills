---
title: Include Before/After Metrics Tables
impact: MEDIUM
impactDescription: provides concrete evidence of improvement for PRs and stakeholder communication
tags: tracking, metrics, tables, measurement
---

## Include Before/After Metrics Tables

Every spec should include a metrics table showing expected improvement. After implementation, update with actual values.

**Incorrect (no measurable targets):**

```markdown
## Goals
- Make it faster
- Improve the code
- Better developer experience
```

Vague, unmeasurable, impossible to verify completion.

**Correct (concrete metrics table):**

```markdown
### Key Metrics
| Metric | Current (V1) | Target (V2) | Actual (V2) | Improvement |
|--------|-------------|-------------|-------------|-------------|
| **Hooks** | 7 | 6 | 6 | -1 hook |
| **API Calls/Session** | 5 | 1 | 1 | **-80%** |
| **Cache Invalidation** | Global | Targeted | Targeted | 50-70% fewer refetches |
| **Type Safety** | Mixed | Full stack | Full stack | 100% typed |
| **Polling Requests/Day** | 2880 | 0 | 0 | **-100%** |
```

Note: The "Actual" column is filled in after implementation.

**Common metrics by feature type:**

Migration specs:
- Hook/component count (before/after)
- Network requests per session
- Cache invalidation scope (global vs targeted)
- Type safety coverage
- Files affected/changed/deleted

Performance specs:
- Build time, bundle size
- Dev server start time, HMR speed

UX specs:
- Interaction steps reduced
- Vertical space saved
- Component count
