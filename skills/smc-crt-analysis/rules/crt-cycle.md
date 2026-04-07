---
title: CRT Cycle
impact: CRITICAL
impactDescription: core candle range theory execution protocol
tags: CRT, candle-range, turtle-soup, TBS, manipulation
---

## CRT Cycle

Operating Range = previous candle's high/low (H4 or Daily). This is the core CRT protocol.

**Incorrect (trading without CRT context):**

```
- Entering on first sweep of range without checking close
- Not identifying the reference candle
- Confusing classic CRT with TBS (True Breakout Signal)
```

**Correct (full CRT cycle):**

```
CRT Cycle:
1. Reference candle defines range (previous H4/Daily high and low)
2. New candle opens
3. False initial move sweeps one side (manipulation)
4. Check close:
   - Closes INSIDE (wick sweep) → Classic CRT / Turtle Soup
     → Expansion OPPOSITE to the swept side
   - Closes OUTSIDE (body) → TBS
     → Possible real breakout, provides counterparty

Range Types (Will Street & ClutiFx classification):
- Intra TS: Second Turtle Soup within same range — confirms reversal
- R. Pendiente: Smaller range inside larger, same target, no retracement
  → BEST R:R, clear institutional intent
- R. Reiniciada: Price restructures within range before continuing
  → WORST R:R, erratic moves
- R. Previa: Almost reaches target, next candle manipulates and sets new target
  (like Inside Bar)
- R. Completada: Price hits target fast and retraces
  → Quick impulse then exhaustion
```
