---
title: Premium / Discount Zones
impact: HIGH
impactDescription: determines valid trade direction within range
tags: premium, discount, equilibrium, range
---

## Premium / Discount Zones

Divide the trading range (swing H to swing L) at 50% to identify valid trade direction.

**Incorrect (ignoring range position):**

```
- Taking long entries in premium zone (above 50%)
- Taking short entries in discount zone (below 50%)
- Entering at equilibrium with no edge
```

**Correct (zone-aware entries):**

```
1. Calculate the 50% level of the current trading range:
   Equilibrium = (Swing High + Swing Low) / 2

2. Classify zones:
   - Premium (>50%): Sell zone only
   - Discount (<50%): Buy zone only
   - Equilibrium (50%): No edge — avoid entries

3. Only take trades aligned with zone:
   - Buys: Look for POIs in discount zone
   - Sells: Look for POIs in premium zone
```
