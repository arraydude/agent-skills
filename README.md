# Agent Skills

A collection of skills for AI coding agents.

## Skills (skills.sh format)

Skills follow the [Agent Skills](https://skills.sh/) format. Most activate when the agent detects a relevant task; `qa-verify`, `babysit-pr` and `react-query-migrate-v5` run only when invoked by hand.

### react-query-best-practices

TanStack Query (React Query) rules for **v4 and v5**, checked against the official v5.107 docs and changelog and based on TkDodo's blog series. The agent pins the installed version from the lockfile first, then applies only the rules and code blocks for that version.

**Use when:**
- Writing, reviewing or debugging queries, mutations, invalidation and cache updates
- Server rendering, suspense, prefetching or infinite queries
- WebSocket-driven data, TypeScript and testing setups
- Checking what a v4 → v5 or v5.x upgrade breaks and how to fix it

**Categories covered:**
- Query Keys & Patterns (Critical)
- Mutations & Updates (Critical)
- Caching Strategy (High)
- SSR & Hydration (High)
- Suspense, Prefetching & Infinite Queries (High)
- WebSocket Integration (High)
- TypeScript (Medium)
- Testing (Medium)
- Tooling (Medium)
- Common Pitfalls (Medium)
- Migration v4 → v5 (High)
- Upgrading within v5 (High)

### react-query-migrate-v5

Upgrades a repo's `@tanstack/react-query` to the latest v5 release, from v4 or from an older v5 minor. It records a baseline, bumps every TanStack Query package, runs the official codemods, sweeps the code for each `migration-` and `upgrade-` rule, and validates against the baseline. The final report lists the changes that compile cleanly but still shift runtime behaviour.

**Invocation:** by hand only (`/react-query-migrate-v5 [target-version]`). Install `react-query-best-practices` alongside it: the fixes live in its rules.

### smc-crt-analysis

SMC + CRT (Smart Money Concepts + Candle Range Theory) technical analysis framework for institutional order flow analysis.

**Use when:**
- Analyzing any asset (stocks, crypto, forex) using SMC/CRT
- Identifying market structure, order blocks, or liquidity sweeps
- Reading price action with institutional flow concepts
- Planning entries/exits with sniper or swing setups
- Identifying manipulation patterns on any timeframe

**Categories covered:**
- Market Structure (Critical)
- Liquidity Mapping (Critical)
- CRT - Candle Range Theory (Critical)
- Order Blocks & POIs (High)
- Premium / Discount Zones (High)
- Risk Management (High)
- SMT Divergence (Medium)
- Time & Price Alignment (Medium)
- IPDA Cycles (Medium)

### feature-workflow

Feature planning, specification, phased implementation, progress tracking, per-phase PRs, and archival workflow.

**Use when:**
- Starting a new feature or migration
- Creating or updating a spec document
- Breaking work into implementation phases
- Tracking progress within a spec
- Deciding PR scope and branch strategy
- Archiving completed specs

**Categories covered:**
- Spec Structure & Content (Critical)
- Phase Design (Critical)
- Progress Tracking (High)
- PR Strategy (High)
- Archival (Medium)
- Workflow Collaboration (Medium)

**Assumes GitFlow:** feature PRs target `develop`.

### validate-pr

Validate AI-generated PR review comments. Checks whether AI comments are accurate or hallucinated by cross-referencing each one against the actual code changes, then reports a prioritized summary.

**Prerequisites:** Requires `gh` CLI installed and authenticated.

**Use when:**
- Checking AI/bot review comments on a PR for accuracy
- Triaging which review feedback is worth addressing before merge
- Separating genuine findings from hallucinations or misread intent
- Producing a prioritized action list from a noisy automated review

**Usage:** ask in plain language, or run `/validate-pr [pr-number-or-url]`. Without a PR it validates the current branch's PR.

**Categories covered:**
- Setup & Input (Critical)
- Data Gathering (Critical)
- Validation (Critical)
- Output (High)

### qa-verify

End-to-end QA in a headed browser. Maps the diff to the user journeys it reaches, runs each journey on `origin/main` (Before) and on the branch (After) from the same DB snapshot, and publishes a Before/After screenshot table to the PR. Reports regressions without touching product code.

**Invocation:** by hand only (`/qa-verify`).

**Prerequisites:** `gh` CLI authenticated, a local stack the agent can start, and a headed browser tool. Project specifics (how to log in as each persona, seed data, start the stack) are read from the repo's `AGENTS.md` / `CLAUDE.md`.

### babysit-pr

Drives one PR to merge-ready without the human in the loop: merges `origin/main`, fixes failing checks it caused, routes breakage that is already red on main to another session, runs `qa-verify`, enables auto-merge pinned to the verified SHA, and posts the PR to the team's review channel. Escalates on a QA regression, a conflict that needs a product decision, or a blocking credential.

**Invocation:** by hand only (`/babysit-pr [pr] [--skip-qa]`). Install `qa-verify` alongside it unless you always pass `--skip-qa`.

**Prerequisites:** `gh` CLI authenticated with push access; auto-merge enabled on the repo. Optional: chat access for the review post (otherwise the line is handed back for you to paste).

## Installation

Install via the skills CLI:

```bash
npx skills add arraydude/agent-skills --skill react-query-best-practices
npx skills add arraydude/agent-skills --skill smc-crt-analysis
npx skills add arraydude/agent-skills --skill feature-workflow
npx skills add arraydude/agent-skills --skill validate-pr
npx skills add arraydude/agent-skills --skill qa-verify
npx skills add arraydude/agent-skills --skill babysit-pr
npx skills add arraydude/agent-skills --skill react-query-migrate-v5

# babysit-pr runs qa-verify, so install them together
npx skills add arraydude/agent-skills --skill qa-verify --skill babysit-pr

# react-query-migrate-v5 applies react-query-best-practices rules
npx skills add arraydude/agent-skills --skill react-query-best-practices --skill react-query-migrate-v5

# List what the repo ships
npx skills add arraydude/agent-skills --list
```

## Usage

**Model-invoked skills** are used when the agent detects a relevant task:
```
Help me set up React Query with proper caching
Review this useQuery implementation
How should I handle WebSocket updates with React Query?
```

**Hand-invoked skills** run only from their `/` command:
```
/qa-verify
/babysit-pr 123 --skip-qa
/react-query-migrate-v5
```

In Claude Code, any skill also runs as `/<skill-name>`, e.g. `/validate-pr 123`.

## Structure

Every skill has a `SKILL.md` with the agent's instructions. Beyond that:
- **Rule-based skills** add `rules/` (one file per rule, with examples) and `AGENTS.md` (all rules compiled, rebuilt whenever a rule changes).
- **Workflow skills** (`qa-verify`, `babysit-pr`, `react-query-migrate-v5`) keep their steps in `SKILL.md` and move branch-specific reference into sibling files (e.g. `babysit-pr/route-unrelated.md`).

## License

MIT
