---
title: Order Block Validation
impact: HIGH
impactDescription: ensures only high-probability POIs are traded
tags: order-block, POI, momentum, imbalance, FVG
---

## Order Block Validation

A valid Order Block requires ALL three conditions. Missing any one invalidates the OB.

**Incorrect (incomplete OB validation):**

```
- Marking any red/green candle as an OB
- Ignoring whether FVG exists after the impulse
- Trading OBs in premium zone for buys (wrong location)
```

**Correct (full validation):**

```
Valid OB requires ALL three:
1. Momentum: Candle creates acceleration/impulse
2. Imbalance: FVG left by the impulse
3. Location: Discount zone for buys, premium zone for sells

Sensitive zones within OB:
- Open of the block candle
- 50% level (highest institutional volume)

Formula: OB + Imbalance + Liquidity + Structure = Valid POI

POI Hierarchy:
- Extremo/Original: Origin of the move — highest probability
- Decisional: Zone that caused BOS — lower probability, IS liquidity itself

Rule: No significant retracement before BOS → ignore the Decisional. Target the Extremo.

Voids: Long wicks on HTF containing OBs and imbalances on LTF.
Most important on Daily+.
```
