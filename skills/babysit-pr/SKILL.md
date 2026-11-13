---
name: babysit-pr
description: Drive a PR to merge-ready on its own: update from main, fix its failures, route unrelated CI breakage, QA it, enable auto-merge, and hand it off for review.
disable-model-invocation: true
license: MIT
metadata:
  author: arraydude
  version: "1.0.0"
---

# Babysit PR

Carry one PR to **review handoff**: the gate green on the head SHA, QA passed
(unless `--skip-qa`), auto-merge attempted with its status reported, and the
link posted to the team's review channel. The human stays out of the loop until
the review handoff or until the loop **escalates**.

Work autonomously: at every fork take the recommended action and keep going.
The loop stops only through an escalation trigger.

## Setup

- **Target PR:** the argument (number or URL), else the current branch's PR.
  No PR for the branch → push it and open one, body from the repo's PR
  template.
- **`--skip-qa`:** skip step 5 for this PR. Store it as `skipQa` in the state
  file, so wakeups and scheduled re-runs keep it.
- **State file:** `.context/babysit-pr/<pr-number>/state.json`. Read it first
  on every invocation and wakeup, so a resumed run continues where the last one
  stopped; create it on the first run:

  ```json
  {
    "waitingOn": null,
    "lastQaSha": null,
    "lastQaResult": null,
    "postedForReview": false,
    "skipQa": false
  }
  ```

- **Gate:** the lint and test checks on the head SHA: the CI aggregate check if
  the repo has one, plus any other lint or test workflow. Every other check is
  informational: it never blocks the loop, and the final report lists the ones
  that aren't green.
- **Project facts:** read the per-file lint/typecheck command, the test runner,
  and the review channel from the repo's `AGENTS.md` / `CLAUDE.md`. A missing
  review channel sends step 8 down its fallback.

## Guardrails

- **History moves forward:** merge `origin/main` in and push.
- **Merge only through auto-merge** in step 7.
- **Stay on this PR's branch.** Unrelated breakage is fixed in another
  session.
- **Validate with** the project's per-file lint/typecheck and the tests
  covering the files you touched.

## Escalate

Post a PR comment starting with `<!-- babysit-pr:escalation -->` that names the
trigger, the evidence (run URL, failing test, QA row), and the decision the
human owns. Then end the turn with the same message, so it reaches the human
through whatever channel the runtime relays final messages on (locally it
stays in chat). The loop stops.

Triggers:

- QA returns a ❌ Regression.
- A merge conflict needs a product decision (both sides change behaviour).
- A credential or human action blocks progress, except an auto-merge failure
  or unavailable merge/review metadata in step 7: report it and continue to
  step 8.

## The loop

### 1. Open

- Merged or closed → report it and stop.
- Draft → mark it ready for review.

Done when the PR is open and ready for review.

### 2. Update from main

`git fetch origin && git merge origin/main`, resolving conflicts so both sides
keep their intent. Validate every file you touched, then push.

Done when the branch contains `origin/main` and the push succeeded (or there
was nothing to merge).

### 3. Wait for CI

Actively monitor the PR's CI until the gate checks finish. If the runtime
can't monitor, schedule a task in 1 hour that runs `/babysit-pr <pr>` again.

Gate green → step 5. Any gate check red → step 4.

### 4. Classify each red gate check

Read the log and give the check one class:

| Class         | Rule                                                                                              | Action                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Ours**      | The failing test, or the code it tests, is in the PR diff.                                        | Reproduce, fix whichever side is wrong for the PR's intent, validate, push. |
| **Unrelated** | Not in the diff, and the same job also fails on the latest completed run of its workflow on main. | Follow [route-unrelated.md](route-unrelated.md).                            |
| **Flaky**     | Not in the diff, and main is green for that job.                                                  | Watch until the run ends, then rerun failed, once. Red again → **Ours**.    |

Done when every red gate check has a class and its action is taken. Back to
step 3.

### 5. QA

`skipQa` → go to step 6.

Run QA when `lastQaSha` is empty, when commits since `lastQaSha` touched
product code (anything outside test files), or when step 2 resolved conflicts.
Otherwise reuse `lastQaResult`, set `lastQaSha` to the current head SHA, save
the state file, and go to step 6. Here `lastQaSha` records the commit covered
by the result, including valid reuse after test-only changes.

Follow the sibling [`qa-verify`](../qa-verify/SKILL.md) skill, answering each
of its **Ask** gates here:

- Variants: the recommended ones.
- Matrix gate: write the matrix to its `matrix.md` and proceed.
- Variants that can't be set up locally: try to configure once, then ⬜ Not
  verified.
- Credential blockers: ⬜ Not verified for the affected rows.
- Project facts the repo doesn't state: infer them from its scripts and README;
  a fact that still blocks a journey makes that row ⬜ Not verified.
- Screenshots: skip the attachment upload (qa-verify step 5.1) and its
  read-back check (step 5.3); fill each Before and After cell with a short text
  description of what that side showed.

Done when the QA table is published and `lastQaSha` / `lastQaResult` are
recorded. Any ❌ → escalate. Otherwise → step 6.

### 6. Confirm green

Done when the gate is green on the current head SHA and, unless `skipQa`,
`lastQaSha` equals that SHA. Anything else → step 3.

An unavailable aggregate status or merge/review metadata does not prove CI
failed. Verify the gate from the check or workflow results you can read. If
the gate cannot be verified, escalate: unknown CI counts as red.

### 7. Enable auto-merge

Enable auto-merge on the PR, pinned with `expectedHeadOid` to the SHA verified
in step 6, and attempt it even when merge/review metadata is unavailable. Keep
branch protections and required reviews in force: auto-merge is the only merge
path, never an admin or direct merge. Enabling auto-merge can merge immediately
if all requirements are met.

Done when the result is recorded: auto-merge enabled (read back; "unverified"
if the read-back is unavailable) or the exact error. Either way → step 8.

### 8. Hand off to review

Skip when `postedForReview` is true. Otherwise resolve the PR author to a
verified chat user ID (for Slack, via the author's email or an existing
GitHub-to-Slack mapping) and mention them so the chat notifies the author
(`<@USER_ID>` on Slack). If no verified match is available, use the author's
name (else GitHub login) and report that the mention could not be resolved.
Send exactly one line:

```
<title> by <author mention> needs review: <url>
```

The message contains only this line. CI, QA, head SHA, auto-merge status and
other details go in the final report.

Post it to the review channel with whatever chat access the runtime has. No
channel configured, no chat access, or the post fails → end the final message
with the line, for the human to paste.

Set `postedForReview: true`.

Done when the link is posted or handed over. Final report: the PR link, fixes
pushed, checks routed, auto-merge status and any enable error, informational
checks that aren't green, and the ⚠️ / ⬜ QA rows (or "QA skipped").
