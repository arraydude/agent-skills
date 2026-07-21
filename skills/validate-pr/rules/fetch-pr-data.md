---
title: Fetch All PR Data in One Call
impact: CRITICAL
impactDescription: partial data leads to validating comments without their surrounding context
tags: fetch, gh, comments, reviews, json, files
---

## Fetch All PR Data in One Call

Pull the comments, reviews, body, title, and changed files together so every comment can be judged against the PR's actual content and metadata.

**Why:** A comment can only be validated in context — you need the PR body (intent), the file list (is the referenced file even touched?), the reviews (review-level summaries), and the comments (the claims to check). Fetching these piecemeal wastes calls and invites gaps.

**Incorrect (grab only the comment text, lose all context):**

```bash
gh pr view 123 --json comments
# No file list, no reviews, no body — you can't tell if a comment
# references a file the PR never changed.
```

**Correct (one call for everything you need):**

```bash
gh pr view 123 --json comments,reviews,body,title,files
```

Then enumerate **both** streams the response contains:
- `comments` — general PR conversation comments
- `reviews` — review submissions (approve/request-changes/comment) and their bodies

List every item before moving on to validation. Note that inline review-thread comments are not fully covered here — see `fetch-complete-coverage`.
