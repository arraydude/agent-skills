---
name: smc-crt-analysis
description: Analyze any asset (stocks, crypto, forex) using Smart Money Concepts (SMC) and Candle Range Theory (CRT). Use when the user asks for technical analysis, market structure analysis, liquidity analysis, order block identification, or price action reading. Triggers include "SMC analysis", "CRT analysis", "market structure", "order blocks", "liquidity sweep", "break of structure", "change of character", "fair value gap", "imbalance", "premium/discount", "smart money", "institutional flow", "POI", "sniper entry", "turtle soup", "where is smart money", "Wyckoff", "Elliott Wave", or any request to analyze price charts using institutional order flow concepts. Also triggers when analyzing entry/exit points, stop loss placement, or identifying manipulation patterns on any timeframe.
license: MIT
metadata:
  author: arraydude
  version: "1.0.0"
---

# SMC + CRT Analysis Framework

Multi-timeframe institutional order flow analysis. Follow this top-down protocol for every analysis.

## 1. Market Structure (HTF → LTF)

Identify structure on the highest relevant timeframe first:

- **Bullish:** HH + HL. BOS confirms when price breaks previous HH.
- **Bearish:** LH + LL. BOS confirms when price breaks previous LL.
- **Consolidation:** EQH + EQL — range-bound.
- **CDC/CHoCH:** First break of opposing swing = potential reversal.

Strong vs Weak points:
- **Strong Low** = created by a BOS upward (protected, not expected to break)
- **Weak High** = not yet broken upward (liquidity target)

Three types of structural breaks (from the books):
1. Wick-to-wick mapping, wick break
2. Wick-to-wick mapping, body break (used for CHoCH)
3. Body-to-body mapping, body break (most conservative)

## 2. Liquidity Mapping

Map ALL liquidity before identifying POIs:

- **BSL:** Buy stops above swing highs, EQH, trendlines
- **SSL:** Sell stops below swing lows, EQL, trendlines
- **IRL:** FVGs/imbalances inside the range
- **ERL:** Swing highs/lows at range boundaries

**Golden rule:** Liquidity must exist BEFORE the POI. Price sweeps liquidity, then reacts at the OB.

**Inducement:** False BOS to trap retail. Small structure break → immediate reversal → real move opposite.

**Killzones (best session times):**
- London: 2:00-5:00 AM ET
- New York: 7:00-10:00 AM ET (highest volatility per Ross/CarpinchoTrader)
- Asian session range defines ARL (Asia Range Liquidity)

## 3. Order Blocks & POIs

Valid OB requires ALL three:
- **Momentum:** Candle creates acceleration/impulse
- **Imbalance:** FVG left by the impulse
- **Location:** Discount zone for buys, premium zone for sells

Sensitive zones within OB:
- **Open** of the block candle
- **50% level** (highest institutional volume)

**POI Hierarchy:**
- **Extremo/Original:** Origin of the move — highest probability
- **Decisional:** Zone that caused BOS — lower probability, IS liquidity itself

Rule: No significant retracement before BOS → ignore the Decisional. Target the Extremo.

Formula: **OB + Imbalance + Liquidity + Structure = Valid POI**

**Voids:** Long wicks on HTF containing OBs and imbalances on LTF. Most important on Daily+.

## 4. Premium / Discount

Divide trading range (swing H to swing L) at 50%:
- **Premium (>50%):** Sell zone
- **Discount (<50%):** Buy zone
- **Equilibrium (50%):** No edge

## 5. CRT (Candle Range Theory)

Operating Range = previous candle's high/low (H4 or Daily).

**CRT Cycle:**
1. Reference candle defines range
2. New candle opens
3. False initial move sweeps one side (manipulation)
4. Check close:
   - **Closes INSIDE (wick sweep)** → Classic CRT / Turtle Soup → Expansion OPPOSITE
   - **Closes OUTSIDE (body)** → TBS → Possible real breakout, provides counterparty

**Range Types (Will Street & ClutiFx classification):**
- **Intra TS:** Second Turtle Soup within same range — confirms reversal
- **R. Pendiente:** Smaller range inside larger, same target, no retracement — **best R:R**, clear institutional intent
- **R. Reiniciada:** Price restructures within range before continuing — **worst R:R**, erratic moves
- **R. Previa:** Almost reaches target, next candle manipulates and sets new target (like Inside Bar)
- **R. Completada:** Price hits target fast and retraces — quick impulse then exhaustion

**PDM (Punto de Máxima Decisión):**
Occurs when TS forms and price validates by resting on a previous candle's wick. Sequence: TS → PDM → NWM/SLF → Expansion. Key candles: PDM (validates support/resistance) + Vela Pendiente (confirms intent without retracement).

**Fractal Execution Protocol:**
- H4 = direction (bias)
- M15 = identify trap/manipulation
- M1 = execute entry

**Double Liquidity Sweep (Ross's key rule):**
- Wait for TWO sweeps, not one
- First sweep traps the impatient
- Second sweep cleans their stops
- Enter after second sweep + SMT divergence + rejection candle
- SL below second swept low
- Minimum R:R = 1:5

## 6. SMT Divergence

Compare correlated assets — one sweeps a level, the other doesn't → confirms manipulation.

**Positive correlations (move together):**
- EUR/USD ↔ GBP/USD
- AUD/USD ↔ NZD/USD
- ES ↔ NQ ↔ YM (US indices)
- Gold ↔ Silver
- BTC ↔ ETH

**Negative correlations (move opposite):**
- DXY vs EUR/USD, GBP/USD, AUD/USD
- DXY vs ES, NQ, YM

Pro tip: Invert DXY chart scale to see manipulations clearly — inverted DXY sweep high → EUR/USD and GBP/USD likely drop.

## 7. Time & Price

**Power hour:** 17:00 ET — all timeframes align (new daily candle).

**Timeframe hierarchy:**
- Macro: 1M / 2W / 3D / 2D / 1D
- Daily: 12H / 8H / 6H / 4H / 3H / 144min / 2H / 90min / 1H
- Entry: 15min / 5min

**Best session times (ET):**
- NY: 08:00 (90min/3H), 09:00 (2H/4H/8H), 11:00 (90min/2H/3H/6H)
- London: 03:00 (2H), 05:00 (90min/2H/3H/4H/6H/12H)
- Asia: 20:00 (90min/3H), 21:00 (2H/4H), 23:00 (90min/2H/3H/6H)

## 8. IPDA Cycles

Interbank Price Delivery Algorithm: 20-40-60 day windows.
- Look for unfilled FVGs and OBs from 20, 40, 60 days ago
- Price rebalances these inefficiencies within these cycles

## Output Format

Structure every SMC+CRT analysis as:

1. **HTF Structure** — Current trend, BOS/CDC levels
2. **Liquidity Map** — BSL/SSL pools, EQH/EQL, inducement
3. **Key POIs** — OBs validated with momentum + imbalance + location
4. **Premium/Discount** — Position within range
5. **CRT Reading** — Recent candle range setups, sweep status
6. **SMT Check** — Correlated asset divergence
7. **Bias + Levels** — Direction, entry, SL, TP

## Risk Management

- P = (K × R) / (Entry - StopLoss)
- Max 2 stop losses per day → stop trading
- Min R:R 1:5 sniper, 1:3 swing
- SL below second swept low (not first)
- Always calculate and accept risk BEFORE entering
- Think in percentages, not dollars
