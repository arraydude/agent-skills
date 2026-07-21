---
title: Verify the GitHub CLI Is Installed and Authenticated
impact: CRITICAL
impactDescription: without gh, no PR data can be fetched and the whole workflow fails
tags: setup, gh, cli, prerequisites, auth
---

## Verify the GitHub CLI Is Installed and Authenticated

Every step of this skill depends on the `gh` CLI. Check that it exists **and** is authenticated before doing anything else — a missing or unauthenticated `gh` produces confusing failures midway through.

**Why:** Comments, reviews, diffs, and inline review threads are all fetched through `gh`. If it is not installed you cannot proceed; if it is installed but not logged in, `gh api` calls fail with an auth error that looks unrelated to the real cause.

**Incorrect (assume gh works, fail deep into the workflow):**

```bash
# Jump straight to fetching, then hit an opaque error halfway through
gh pr view 123 --json comments
# → error: authentication required (surfaced far from the real cause)
```

**Correct (check availability and auth first, guide the user if missing):**

```bash
# 1. Is gh installed?
which gh || echo "gh not found"

# 2. Is it authenticated?
gh auth status
```

If `gh` is missing, stop and tell the user how to install and authenticate:

```
Error: GitHub CLI (gh) is required but not installed.

Install:   brew install gh      # macOS
Then run:  gh auth login
```

Only continue once both checks pass.
