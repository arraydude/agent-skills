---
title: PDM - Punto de Máxima Decisión
impact: HIGH
impactDescription: validates support/resistance after turtle soup
tags: CRT, PDM, validation, vela-pendiente
---

## PDM (Punto de Máxima Decisión)

Occurs when Turtle Soup forms and price validates by resting on a previous candle's wick.

**Incorrect (entering without PDM validation):**

```
- Entering immediately after first Turtle Soup
- Not waiting for price to rest on previous wick
- Skipping the confirmation sequence
```

**Correct (full PDM validation sequence):**

```
Sequence: TS → PDM → NWM/SLF → Expansion

Key candles:
- PDM: Validates support/resistance by resting on previous wick
- Vela Pendiente: Confirms intent without retracement

The PDM confirms that the level swept by the Turtle Soup
is being respected, adding confluence to the trade setup.
```
