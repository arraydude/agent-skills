---
title: Present Findings as a Priority-Sorted Summary Table
impact: HIGH
impactDescription: a scannable, prioritized table is what makes the validation actionable
tags: output, table, priority, assessment, format
---

## Present Findings as a Priority-Sorted Summary Table

Report the result as a single table sorted by priority (Critical first), with a clear assessment for each comment. This is the primary deliverable of the skill.

**Why:** After validating many comments, the author needs to see at a glance what to fix, what to skip, and what was invented. A prioritized table with consistent assessment labels turns a wall of review comments into a short action list.

**Incorrect (unordered prose dump):**

```text
Comment 1 might be valid. Comment 2 is probably fine. Comment 3 could be an
issue but I'm not sure. Comment 4 ...
```

**Correct (priority-sorted table with fixed assessment vocabulary):**

```markdown
| # | Brief Comment | Assessment | Priority |
|---|---------------|------------|----------|
| 1 | Description of the concern... | ✅ Valid | Critical |
| 2 | Description of the concern... | ✅ Valid | High |
| 3 | Description of the concern... | ⚠️ Low Priority | Medium |
| 4 | Description of the concern... | ⚠️ Low Priority | Low |
| 5 | Description of the concern... | ❌ Hallucination | - |
```

Assessment vocabulary (use these exact labels):
- ✅ **Valid** — worth addressing
- ⚠️ **Low Priority** — valid but not worth the change
- ❌ **Hallucination** — incorrect assumption or invented
- ✔️ **Addressed** — already handled in the code

Priority order (sort Critical → Low; use `-` for hallucinations/addressed):
**Critical** (must fix before merge) → **High** (should address) → **Medium** (nice to have) → **Low** (minor).

Close with a prompt so the author can drill in:

> Ask for details on any item by number (e.g., "more on #2")
