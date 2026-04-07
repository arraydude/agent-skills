---
title: Fractal Execution Protocol
impact: HIGH
impactDescription: multi-timeframe entry precision
tags: CRT, fractal, execution, multi-timeframe, entry
---

## Fractal Execution Protocol

Use three timeframes for precise entries aligned with higher timeframe direction.

**Incorrect (single timeframe trading):**

```
- Taking entries based on one timeframe only
- Using H4 for entries (too wide SL)
- Using M1 for direction (noise)
```

**Correct (fractal execution):**

```
Three-timeframe protocol:
- H4 = direction (bias) — determines if looking for longs or shorts
- M15 = identify trap/manipulation — CRT sweep, inducement
- M1 = execute entry — precise entry after confirmation

This ensures tight stop losses with high-timeframe directional alignment.
```
