---
name: qa-verify
description: End-to-end QA in a headed browser that compares origin/main (Before) with the branch (After) across every user journey the diff reaches, then publishes a screenshot table to the PR.
disable-model-invocation: true
license: MIT
metadata:
  author: arraydude
  version: "1.0.0"
---

# QA verify

Manual end-to-end verification in a headed browser. The run proves two things with
screenshots: the change does what it claims (**fix scenarios**), and every user
journey the diff can reach still behaves as it does on `origin/main`
(**regression scenarios**). Both sides run in the same workspace, one after the
other, from the same database snapshot, so the only difference between Before
and After is the code.

The deliverable is a **QA table** in the PR body. QA reports and leaves product
code as it is. A regression becomes a red row, and the human decides what to do
with it.

## Keep working toward the goal

The local workspace is disposable. Repair the database, login, dependencies,
services and configuration on your own, then resume. Repairs stay in the
environment and never touch product code, and any check a repair affected runs
again. Ask only when a credential or a human action blocks recovery, and keep
the other journeys running meanwhile.

**Ask** means one question with two to four options plus a free-text answer,
through the host's question tool (plain text if it has none). Batch the
questions of one gate into a single call.

## Project facts

The skill runs on any web app. Read the project-specific facts below from the
repo's `AGENTS.md` / `CLAUDE.md`, its docs and its scripts:

- how to start the stack locally, and where the server logs go;
- the personas (roles) and how to log in as each one: a login helper skill or
  command, seeded credentials, or the app's own login page;
- how to seed data, and the database engine (it decides the snapshot method);
- feature-flag storage, and any cache to clear after a flag change;
- the PR description template.

Ask once for whatever the repo does not say, and recommend saving the answers
to `AGENTS.md` so the next run finds them.

## 1. Preflight

1. **PR.** No open PR for the branch → **Ask**: open a draft PR now (body from
   the repo's PR template) / run and leave the table in `.context/qa-verify/`
   without publishing / stop.
2. **Base freshness.** Branch behind `origin/main` → merge `origin/main` into
   the branch now.

## 2. Map the blast radius to journeys

The unit is the **journey**: a persona pursuing a goal through the product,
step by step, across features. "Billing closes the month: reviews usage,
generates invoices, charges cards, syncs to accounting" is a journey; "the
invoices page" is only a surface on it. Features feed each other (signup →
subscription → invoice → payment → accounting sync), so a change is felt
downstream, far from the file that changed.

Build the map in three hops and write it down:

1. **Diff → surfaces.** For every changed file, trace what a user can see or
   trigger: routes and the dialogs they open, API endpoints and every screen
   that calls them, background jobs and crons (follow the event from the code
   that emits it to its consumers and on to the record they change), webhooks,
   customer-facing portals, emails, SMS and PDFs. A file with no user surface
   is listed as such, with the reason.
2. **Surfaces → journeys.** For each surface, name the personas who reach it
   and the journeys that pass through it, including the steps that happen
   _after_ it and consume its output.
3. **Journeys → variants.** Find the axes where the code on those journeys
   branches: role or permission checks, feature flags, and tenant or account
   configuration (an integration connected, a payment provider, a legacy vs.
   new mode). An axis earns a variant only where the code actually branches on
   it.

Done when every changed file maps to at least one surface (or is marked "no
user surface"), every surface maps to at least one journey, and every journey
lists its branching axes.

Surfaces a desktop browser cannot drive (native mobile apps, desktop clients,
apps the local stack does not run) become **not verified** rows naming what
the check would need. Leave them unattempted.

## 3. Scenario matrix

One row per journey × variant. Each row carries:

- **ID and slug**: `S1-billing-close-month-limited-role`. The slug names the
  screenshot files.
- **Kind**: fix or regression.
- **Persona and login**: tenant, user, login method, the protected route to
  land on, and what on screen proves the right user and tenant are active.
- **Steps**: the clicks, written so another person could replay them.
- **Final state**: the screen that gets captured.
- **Expected**: what correct looks like on that screen, written _before_
  running, so the verdict is a comparison against a prediction.
- **Data**: the records the steps need and whether they exist in the
  workspace DB.

**Gate.** First show the full matrix in chat as a table: every row with its
ID, kind, persona, steps, expected and data status, then the variants left
out and why. The question tool shows only the options, so the user needs the
matrix in front of them to approve it. If the host hides messages sent before
a question, end the turn with the matrix and ask once the user replies. Then
**Ask**, in a single tool call:

- Which variants to include, as a multi-select listing the recommended ones
  first.
- Approve the matrix / edit it / add scenarios.
- For each variant that cannot be set up locally (an external integration,
  missing credentials): try to configure it / mark it not verified.

## 4. Before and After

Run Before on a detached `origin/main`, then After on the branch.

- Seed missing records through the UI on `origin/main`, record their IDs in
  `matrix.md`, then snapshot the DB. Restore that snapshot before the After
  run, so both sides start from identical data.
- Pre-seed bulk data, or records the diff does not touch, through scripts or
  SQL to keep the journey smooth and repeatable.
- Choose the snapshot method that fits the database. Keep the snapshot for the
  next run on the same sha and drop snapshots from older shas: a full
  workspace DB can be tens of GB.
- Captures and `matrix.md` live in `.context/qa-verify/<main-sha>/` (keep
  `.context/` gitignored). A Before capture for an unchanged scenario on the
  same sha is reused.
- After changing a feature flag, clear the flag cache if the app has one.

## Running a scenario

- Run the app on a local server and drive it in a local headed browser.
- **Login.** Before each journey, and after every commit switch or browser
  restart, confirm the browser is logged in as the row's persona, using the
  login method from [Project facts](#project-facts). Confirmed means the
  expected tenant and user are visible and the row's protected route loads
  without an authorization or session error; the journey starts only after
  that. If login still fails after recovery, mark the journey `Not verified`
  with a login-diagnostic screenshot, which never counts as journey evidence.
- Desktop viewport `1440×1000`. Add `390×844` when the diff touches layout or
  breakpoints.
- Same tenant, user, records, filters and scroll position on both sides.
- Drive the journey through real clicks and keystrokes, step by step. Reaching
  the final state by URL is fine only when that is how the persona gets there.
- One capture per side: the final state, saved under
  `.context/qa-verify/<main-sha>/` with an absolute path. Captures and other QA
  artifacts stay out of git.
- If a product step fails after setup and login work, capture the screen where
  the journey broke and report the result.

**Verdict**, comparing each side against **Expected**:

| Result          | When                                                                 |
| --------------- | -------------------------------------------------------------------- |
| ✅ Fixed        | Fix scenario: Before misses Expected, After meets it.                |
| ✅ Unchanged    | Regression scenario: both sides match Expected.                      |
| ❌ Regression   | After is worse than Before, or a fix scenario still misses Expected. |
| ⚠️ Pre-existing | Both sides miss Expected in the same way.                            |
| ⬜ Not verified | The scenario could not run; say why.                                 |

Done when every row of the approved matrix has a verdict.

## 5. Publish

1. Upload every capture as a GitHub attachment and collect its URL. A filename
   or local path in the table renders as a broken image.
2. Write the section below into the PR body. If the markers already exist,
   replace only what sits between them; otherwise replace any earlier
   screenshot table (such as a "Visual Evidence" table) with this section.
   Leave the rest of the body untouched.

```markdown
<!-- qa-verify:start -->

## QA verification

| Scenario                                                                | Before                                                               | After                                                                | Result   |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- | -------- |
| **S1 · fix** Billing closes month · limited role · flag ON<br>Steps: … | <img src="https://github.com/user-attachments/assets/…" width="420"> | <img src="https://github.com/user-attachments/assets/…" width="420"> | ✅ Fixed |

**Not verified:** mobile app (needs simulator run of …), …

<!-- qa-verify:end -->
```

3. Read the PR body back and check that every Before and After cell has an
   uploaded attachment URL. Publishing is done only when every screenshot
   shows in the PR.
4. Report in chat: the PR link, every ❌ and ⚠️ row with one sentence each, and
   the not verified rows. Leave the workspace on the branch with the stack
   running.
