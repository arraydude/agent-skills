---
title: Resolve the PR Reference From Context or the Current Branch
impact: CRITICAL
impactDescription: skills have no $ARGUMENTS, so the target PR must be inferred correctly or the wrong PR is validated
tags: setup, pr, resolve, branch, url, context
---

## Resolve the PR Reference From Context or the Current Branch

A skill activates from natural language — there is no `$ARGUMENTS` placeholder like a slash command has. Determine which PR to validate from what the user actually said, and fall back to the current branch's PR when they name none.

**Why:** The user might say "validate the AI comments on PR 123", paste a full URL, or just say "check the bot comments on this PR" while sitting on a feature branch. Guessing wrong means validating the wrong PR. The `gh` CLI resolves the current branch's PR automatically when given no number, which is the natural fallback.

**Incorrect (demand an explicit argument, or halt when none is given):**

```text
Error: Please provide a PR number or URL.
Usage: /validate-pr <PR_NUMBER_OR_URL>
```

This is slash-command behavior. A skill should not refuse to run just because the user did not type a number.

**Correct (resolve from the message, else use the current branch):**

```bash
# a) User gave a number → use it directly
gh pr view 123 --json ...

# b) User pasted a URL → extract the trailing number
#    https://github.com/owner/repo/pull/123  →  123
gh pr view 123 --json ...

# c) User named no PR → resolve the current branch's PR
gh pr view --json number,title    # no arg = PR for the checked-out branch
```

If the current-branch lookup returns no PR (`no pull requests found for branch`), ask the user which PR they mean instead of guessing.
