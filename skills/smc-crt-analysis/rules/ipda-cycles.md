---
title: IPDA Cycles
impact: MEDIUM
impactDescription: identifies institutional rebalancing targets
tags: IPDA, cycles, FVG, rebalancing, interbank
---

## IPDA Cycles

Interbank Price Delivery Algorithm operates on 20-40-60 day windows.

**Incorrect (ignoring historical inefficiencies):**

```
- Only looking at recent price action
- Not checking for unfilled FVGs from weeks ago
- Missing institutional rebalancing targets
```

**Correct (IPDA cycle analysis):**

```
1. Look for unfilled FVGs and OBs from 20, 40, 60 days ago
2. Price rebalances these inefficiencies within these cycles
3. Mark these as potential targets for current price action

The IPDA framework reveals where institutions are likely
targeting to fill historical inefficiencies.
```
