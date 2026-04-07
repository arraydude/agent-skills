---
title: Double Liquidity Sweep
impact: CRITICAL
impactDescription: key rule for high-probability entries
tags: CRT, liquidity, sweep, SMT, entry
---

## Double Liquidity Sweep

Wait for TWO sweeps, not one. This is Ross's key rule for filtering false signals.

**Incorrect (entering after first sweep):**

```
- Entering immediately after first liquidity sweep
- Using single sweep as entry trigger
- Setting SL below first swept low
```

**Correct (double sweep protocol):**

```
1. Wait for TWO sweeps, not one
2. First sweep traps the impatient
3. Second sweep cleans their stops
4. Enter after second sweep + SMT divergence + rejection candle
5. SL below second swept low
6. Minimum R:R = 1:5

The double sweep filters out many false signals and aligns
entry with institutional intent.
```
