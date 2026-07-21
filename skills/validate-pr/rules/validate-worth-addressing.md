---
title: Judge Whether a Valid Concern Is Worth Addressing
impact: HIGH
impactDescription: true-but-trivial comments create noise and churn if treated as must-fix
tags: validate, priority, noise, conventions, value
---

## Judge Whether a Valid Concern Is Worth Addressing

A comment being technically correct does not make it worth acting on. Weigh whether fixing it adds real value or just churn, and whether it fits how this project is actually written.

**Why:** AI reviewers surface theoretical edge cases, style nits, and defensive-programming suggestions that are true in the abstract but not worth a change here. Flagging all of them as actionable buries the genuinely important findings and pressures the author into noise.

**Incorrect (mark every technically-true comment as must-fix):**

```text
"Technically an empty array could be passed, so this is a Valid Critical issue."
→ Even though that input never occurs and no other call site guards it.
```

**Correct (assess real impact and project fit):**

For each valid comment, ask:
- Is this a **real problem** or a theoretical edge case that does not occur here?
- Does fixing it **add value**, or just add noise and diff churn?
- Is it **aligned with project patterns and conventions**, or does it fight them?

Then downgrade accordingly:
- Real, must-fix-before-merge → **Critical** / **High**
- True but minor / optional → ⚠️ **Low Priority** (Medium / Low)

Be explicit when something is correct-but-not-worth-it, so the author can consciously skip it rather than feel obligated.
