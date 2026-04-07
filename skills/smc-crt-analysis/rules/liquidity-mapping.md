---
title: Liquidity Mapping
impact: CRITICAL
impactDescription: must map liquidity before POI identification
tags: liquidity, BSL, SSL, IRL, ERL, inducement, killzones
---

## Liquidity Mapping

Map ALL liquidity before identifying POIs. This is non-negotiable.

**Incorrect (skipping liquidity mapping):**

```
- Identifying order blocks without first mapping where liquidity sits
- Ignoring equal highs/lows as liquidity pools
- Not recognizing inducement (false BOS)
```

**Correct (comprehensive liquidity map):**

```
1. Map external and internal liquidity:
   - BSL: Buy stops above swing highs, EQH, trendlines
   - SSL: Sell stops below swing lows, EQL, trendlines
   - IRL: FVGs/imbalances inside the range
   - ERL: Swing highs/lows at range boundaries

2. Golden rule: Liquidity must exist BEFORE the POI.
   Price sweeps liquidity, then reacts at the OB.

3. Identify inducement:
   - False BOS to trap retail
   - Small structure break → immediate reversal → real move opposite

4. Note killzone timing:
   - London: 2:00-5:00 AM ET
   - New York: 7:00-10:00 AM ET (highest volatility)
   - Asian session range defines ARL (Asia Range Liquidity)
```
