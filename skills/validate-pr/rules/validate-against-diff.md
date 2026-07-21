---
title: Cross-Reference Every Comment Against the Actual Diff
impact: CRITICAL
impactDescription: a comment about code that is not in the diff is almost always a hallucination
tags: validate, diff, cross-reference, code, files
---

## Cross-Reference Every Comment Against the Actual Diff

Before judging a comment's merit, confirm the code it talks about actually exists in the change. Read the real diff and the referenced files — do not take the comment's description of the code at face value.

**Why:** AI reviewers frequently reference lines, functions, or files that are not part of the PR, or misread what a hunk does. Verifying against the actual diff is the single most effective hallucination filter. A concern about code the PR never touched cannot be a valid concern about this PR.

**Incorrect (trust the comment's own description of the code):**

```text
Comment: "The new retryRequest() helper swallows errors silently."
→ Marked "Valid" without checking whether retryRequest() is in the diff.
```

**Correct (pull the diff, read the file, then judge):**

```bash
# See the actual changes
gh pr diff 123

# Read the referenced file for full context (not just the diff hunk)
# e.g. src/lib/http.ts around the cited symbol
```

Check, for each comment:
- Is the referenced file part of this PR's changed files?
- Is the cited line/function/symbol actually present in the diff?
- Does the surrounding code confirm or contradict the comment's reading of it?

If the referenced code is absent or the comment misreads it, it is a hallucination — see `validate-hallucination`.
