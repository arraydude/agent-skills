---
title: SMT Divergence
impact: MEDIUM
impactDescription: confirms manipulation via correlated assets
tags: SMT, divergence, correlation, manipulation
---

## SMT Divergence

Compare correlated assets — one sweeps a level, the other doesn't → confirms manipulation.

**Incorrect (trading without cross-asset confirmation):**

```
- Analyzing a single asset in isolation
- Ignoring divergences between correlated pairs
- Not checking DXY when trading forex
```

**Correct (SMT divergence check):**

```
Positive correlations (move together):
- EUR/USD ↔ GBP/USD
- AUD/USD ↔ NZD/USD
- ES ↔ NQ ↔ YM (US indices)
- Gold ↔ Silver
- BTC ↔ ETH

Negative correlations (move opposite):
- DXY vs EUR/USD, GBP/USD, AUD/USD
- DXY vs ES, NQ, YM

When one sweeps a level but its correlated pair doesn't,
this divergence confirms the sweep was manipulation, not
a real breakout.

Pro tip: Invert DXY chart scale to see manipulations clearly —
inverted DXY sweep high → EUR/USD and GBP/USD likely drop.
```
