---
name: validate-pr
description: Validate AI-generated PR review comments — check whether they are accurate or hallucinated by cross-referencing each comment against the actual code changes. Use when the user asks to validate PR comments, review the bot/AI comments on a pull request, check if review comments are accurate or hallucinated, or triage which review feedback is worth addressing. Triggers include "validate PR comments", "are these AI review comments accurate", "check for hallucinated review comments", "review the bot comments on this PR", "which of these PR comments are real", "validate the AI feedback on PR", "triage PR review comments".
license: MIT
metadata:
  author: arraydude
  version: "1.0.0"
---

# Validate PR Comments

Validate AI-generated PR review comments on a pull request — determine which are accurate, which are low-priority noise, and which are hallucinations — by cross-referencing every comment against the actual diff.

## When to Apply

Reference these guidelines when:
- The user wants AI/bot review comments on a PR checked for accuracy
- Triaging which review feedback is worth addressing before merge
- Separating genuine findings from hallucinations or misread intent
- Producing a prioritized action list from a noisy automated review

**Prerequisite:** the `gh` CLI must be installed and authenticated.

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Setup & Input | CRITICAL | `setup-` |
| 2 | Data Gathering | CRITICAL | `fetch-` |
| 3 | Validation | CRITICAL | `validate-` |
| 4 | Output | HIGH | `output-` |

## Quick Reference

### 1. Setup & Input (CRITICAL)

- `setup-gh-cli` - Verify the `gh` CLI is installed and authenticated before anything else
- `setup-resolve-pr` - Resolve the PR from the user's message (number/URL) or fall back to the current branch

### 2. Data Gathering (CRITICAL)

- `fetch-pr-data` - Fetch comments, reviews, body, title, and files in one `gh pr view --json` call
- `fetch-complete-coverage` - Also pull inline review-thread comments; review ALL of them, never a sample

### 3. Validation (CRITICAL)

- `validate-against-diff` - Cross-reference each comment against the real diff and referenced files
- `validate-hallucination` - Classify each comment: Valid / Low Priority / Hallucination / Addressed
- `validate-worth-addressing` - Judge whether a technically-true comment is actually worth the change

### 4. Output (HIGH)

- `output-summary-table` - Present a priority-sorted table with fixed assessment labels
- `output-followup-details` - Expand a single item (comment ID, assessment, verdict) on request

## Core Workflow

1. **Setup** — Confirm `gh` is available and authenticated; resolve which PR to validate.
2. **Fetch** — Pull all PR data plus inline review comments; count them so nothing is dropped.
3. **Validate** — For each comment, cross-reference the diff, decide hallucination vs. valid, and weigh whether it is worth addressing.
4. **Report** — Emit the priority-sorted summary table, then expand any item the user asks about.

## Output Format

Report findings as a single table sorted by priority (Critical first):

| # | Brief Comment | Assessment | Priority |
|---|---------------|------------|----------|
| 1 | Description of the concern... | ✅ Valid | Critical |
| 2 | Description of the concern... | ✅ Valid | High |
| 3 | Description of the concern... | ⚠️ Low Priority | Medium |
| 4 | Description of the concern... | ⚠️ Low Priority | Low |
| 5 | Description of the concern... | ❌ Hallucination | - |

**Assessment labels:** ✅ Valid · ⚠️ Low Priority · ❌ Hallucination · ✔️ Addressed

**Priority levels (sort Critical first):** Critical (must fix before merge) · High (should address) · Medium (nice to have) · Low (minor) · `-` for hallucinations/addressed.

Close with: *Ask for details on any item by number (e.g., "more on #2")*.

## How to Use

Read individual rule files for detailed explanations and examples:

```
rules/setup-gh-cli.md
rules/setup-resolve-pr.md
rules/fetch-pr-data.md
rules/fetch-complete-coverage.md
rules/validate-against-diff.md
rules/validate-hallucination.md
rules/validate-worth-addressing.md
rules/output-summary-table.md
rules/output-followup-details.md
```

Each rule file contains a brief explanation plus incorrect/correct examples.

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`
