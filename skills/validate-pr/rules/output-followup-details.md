---
title: Expand a Single Item on Request
impact: HIGH
impactDescription: the author needs the reasoning and a linkable comment ID to act on any given item
tags: output, followup, details, comment-id, verdict
---

## Expand a Single Item on Request

When the author asks for more on a specific row (e.g. "more on #2"), give the full reasoning behind that assessment, plus the GitHub comment ID so they can jump straight to it.

**Why:** The summary table is intentionally terse. To act on an item — or to disagree with your verdict — the author needs the evidence you used, and a way to open the exact comment on GitHub. The comment ID makes each finding traceable back to its source.

**Incorrect (repeat the one-line table cell):**

```text
#2 is a Valid High priority concern about error handling.
```

That adds nothing beyond the table row.

**Correct (full, traceable expansion):**

```markdown
### #2 — Error swallowed in retryRequest()

- **GitHub Comment ID:** 1234567890  (https://github.com/owner/repo/pull/123#discussion_r1234567890)
- **Assessment:** ✅ Valid — High
- **Why this assessment:** The catch block in src/lib/http.ts:42 returns
  `undefined` without rethrowing or logging; callers treat that as success.
  Confirmed present in the diff; no other layer handles it.
- **Verdict:** Worth fixing before merge — rethrow or surface the error so
  callers can react. Low effort, real correctness impact.
```

Include, for each expanded item:
- **GitHub Comment ID** (and a direct link) for reference
- **Assessment** with the full explanation of why it was categorized that way
- **Verdict** — the final recommendation with concrete reasoning
