# Validate PR Comments - Complete Reference

**Version:** 1.0.0
**Author:** arraydude
**Note:** This document is optimized for AI agent consumption. For quick reference, see `SKILL.md`.

---

## Abstract

This guide covers how to validate AI-generated PR review comments — determining which are accurate, which are low-priority noise, and which are hallucinations — by cross-referencing every comment against the actual code changes. It codifies the process into a repeatable workflow: verify tooling, resolve the target PR, gather every comment (including inline review threads), validate each against the diff, and report a prioritized, actionable summary. Contains 9 rules across 4 categories.

**Prerequisite:** the `gh` CLI must be installed and authenticated.

---

## Table of Contents

1. [Setup & Input](#1-setup--input) -- **CRITICAL**
   - [1.1 Verify the GitHub CLI Is Installed and Authenticated](#11-verify-the-github-cli-is-installed-and-authenticated)
   - [1.2 Resolve the PR Reference From Context or the Current Branch](#12-resolve-the-pr-reference-from-context-or-the-current-branch)
2. [Data Gathering](#2-data-gathering) -- **CRITICAL**
   - [2.1 Fetch All PR Data in One Call](#21-fetch-all-pr-data-in-one-call)
   - [2.2 Cover Every Comment, Including Inline Review Threads](#22-cover-every-comment-including-inline-review-threads)
3. [Validation](#3-validation) -- **CRITICAL**
   - [3.1 Cross-Reference Every Comment Against the Actual Diff](#31-cross-reference-every-comment-against-the-actual-diff)
   - [3.2 Distinguish Hallucinations From Valid Concerns](#32-distinguish-hallucinations-from-valid-concerns)
   - [3.3 Judge Whether a Valid Concern Is Worth Addressing](#33-judge-whether-a-valid-concern-is-worth-addressing)
4. [Output](#4-output) -- **HIGH**
   - [4.1 Present Findings as a Priority-Sorted Summary Table](#41-present-findings-as-a-priority-sorted-summary-table)
   - [4.2 Expand a Single Item on Request](#42-expand-a-single-item-on-request)

---

## 1. Setup & Input

### 1.1 Verify the GitHub CLI Is Installed and Authenticated

**Impact:** CRITICAL

Every step of this skill depends on the `gh` CLI. Check that it exists **and** is authenticated before doing anything else — a missing or unauthenticated `gh` produces confusing failures midway through.

Comments, reviews, diffs, and inline review threads are all fetched through `gh`. If it is not installed you cannot proceed; if it is installed but not logged in, `gh api` calls fail with an auth error that looks unrelated to the real cause.

**Incorrect (assume gh works, fail deep into the workflow):**

```bash
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

### 1.2 Resolve the PR Reference From Context or the Current Branch

**Impact:** CRITICAL

A skill activates from natural language — there is no `$ARGUMENTS` placeholder like a slash command has. Determine which PR to validate from what the user actually said, and fall back to the current branch's PR when they name none.

The user might say "validate the AI comments on PR 123", paste a full URL, or just say "check the bot comments on this PR" while sitting on a feature branch. Guessing wrong means validating the wrong PR. The `gh` CLI resolves the current branch's PR automatically when given no number, which is the natural fallback.

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

---

## 2. Data Gathering

### 2.1 Fetch All PR Data in One Call

**Impact:** CRITICAL

Pull the comments, reviews, body, title, and changed files together so every comment can be judged against the PR's actual content and metadata.

A comment can only be validated in context — you need the PR body (intent), the file list (is the referenced file even touched?), the reviews (review-level summaries), and the comments (the claims to check). Fetching these piecemeal wastes calls and invites gaps.

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

List every item before moving on to validation. Note that inline review-thread comments are not fully covered here — see rule 2.2.

### 2.2 Cover Every Comment, Including Inline Review Threads

**Impact:** CRITICAL

PRs carry two distinct comment surfaces: general conversation comments and inline code-review comments attached to specific diff lines. AI reviewers post most of their claims inline. Review **all** of them.

`gh pr view --json comments` returns conversation-level comments but not the inline review-thread comments anchored to diff lines. Those inline threads are exactly where hallucinated line-specific claims live. Skipping them means silently validating only a fraction of the review.

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

---

## 3. Validation

### 3.1 Cross-Reference Every Comment Against the Actual Diff

**Impact:** CRITICAL

Before judging a comment's merit, confirm the code it talks about actually exists in the change. Read the real diff and the referenced files — do not take the comment's description of the code at face value.

AI reviewers frequently reference lines, functions, or files that are not part of the PR, or misread what a hunk does. Verifying against the actual diff is the single most effective hallucination filter. A concern about code the PR never touched cannot be a valid concern about this PR.

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

If the referenced code is absent or the comment misreads it, it is a hallucination — see rule 3.2.

### 3.2 Distinguish Hallucinations From Valid Concerns

**Impact:** CRITICAL

Think critically about each comment. AI-generated review comments mix genuine findings with confident-sounding fabrications and misread intent. Classify each one deliberately rather than assuming the reviewer was right.

The entire point of validating AI PR comments is to protect the author from acting on invented problems. A comment that reads as authoritative may rest on code that does not exist, an assumption that does not hold, or a misunderstanding of what the change intends.

**Incorrect (treat every AI comment as a real finding):**

```text
"The reviewer says this leaks a connection, so it's a valid Critical issue."
→ No check of whether the connection is actually closed elsewhere.
```

**Correct (interrogate the claim before trusting it):**

For each comment ask:
- Does the referenced code actually exist and behave as described? (see rule 3.1)
- Is the underlying **assumption** true, or does other code already handle it?
- Did the reviewer misunderstand the change's **intent**?
- Does the suggested fix even make sense in this context?

Land on one of four verdicts:
- ✅ **Valid** — real, correctly understood, worth addressing.
- ⚠️ **Low Priority** — technically true but minor / not worth the change.
- ❌ **Hallucination** — references absent code, a false assumption, or a misread.
- ✔️ **Addressed** — already handled in the code as written.

Default to skepticism: if a claim cannot be substantiated against the diff, it is a hallucination, not a "maybe".

### 3.3 Judge Whether a Valid Concern Is Worth Addressing

**Impact:** HIGH

A comment being technically correct does not make it worth acting on. Weigh whether fixing it adds real value or just churn, and whether it fits how this project is actually written.

AI reviewers surface theoretical edge cases, style nits, and defensive-programming suggestions that are true in the abstract but not worth a change here. Flagging all of them as actionable buries the genuinely important findings and pressures the author into noise.

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

---

## 4. Output

### 4.1 Present Findings as a Priority-Sorted Summary Table

**Impact:** HIGH

Report the result as a single table sorted by priority (Critical first), with a clear assessment for each comment. This is the primary deliverable of the skill.

After validating many comments, the author needs to see at a glance what to fix, what to skip, and what was invented. A prioritized table with consistent assessment labels turns a wall of review comments into a short action list.

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

### 4.2 Expand a Single Item on Request

**Impact:** HIGH

When the author asks for more on a specific row (e.g. "more on #2"), give the full reasoning behind that assessment, plus the GitHub comment ID so they can jump straight to it.

The summary table is intentionally terse. To act on an item — or to disagree with your verdict — the author needs the evidence you used, and a way to open the exact comment on GitHub. The comment ID makes each finding traceable back to its source.

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
