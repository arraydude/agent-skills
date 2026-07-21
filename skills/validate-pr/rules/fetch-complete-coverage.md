---
title: Cover Every Comment, Including Inline Review Threads
impact: CRITICAL
impactDescription: inline review comments are the bulk of AI review noise and are easy to miss
tags: fetch, coverage, inline, review, comments, api
---

## Cover Every Comment, Including Inline Review Threads

PRs carry two distinct comment surfaces: general conversation comments and inline code-review comments attached to specific diff lines. AI reviewers post most of their claims inline. Review **all** of them.

**Why:** `gh pr view --json comments` returns conversation-level comments but not the inline review-thread comments anchored to diff lines. Those inline threads are exactly where hallucinated line-specific claims live. Skipping them means silently validating only a fraction of the review.

**Incorrect (stop after the conversation comments):**

```bash
gh pr view 123 --json comments
# Reports "3 comments reviewed" while 20 inline review comments go unchecked.
```

**Correct (also pull the inline review comments, then reconcile the full set):**

```bash
# Inline review-thread comments (line-anchored)
gh api repos/<owner>/<repo>/pulls/123/comments --paginate
```

Then confirm coverage before validating:
- Count conversation comments + inline review comments.
- Make sure every AI-authored item is on your list — do not sample.
- If the counts look low for a PR that clearly had a bot review, re-check pagination (`--paginate`).

State the total number of comments you are validating so the user can confirm nothing was dropped.
