# Agent Skills

A collection of skills and commands for AI coding agents.

## Skills (skills.sh format)

Skills follow the [Agent Skills](https://skills.sh/) format. Most activate when the agent detects a relevant task; `qa-verify` and `babysit-pr` run only when invoked by hand.

### react-query-best-practices

React Query **v4** (TanStack Query) best practices, patterns, and troubleshooting. Based on TkDodo's comprehensive blog series.

**Use when:**
- Implementing new queries or mutations
- Integrating WebSockets with React Query
- Setting up query invalidation patterns
- Debugging React Query behavior
- Optimizing render performance
- TypeScript integration questions

**Categories covered:**
- Query Keys & Patterns (Critical)
- Mutations & Updates (Critical)
- Caching Strategy (High)
- WebSocket Integration (High)
- TypeScript Integration (Medium)
- Testing Patterns (Medium)
- Common Pitfalls (Medium)
- Migration to v5 (High)

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

## Claude Code Commands

Commands require explicit invocation via `/command-name`. They use Claude Code's native command format.

### validate-pr

Validate AI-generated PR review comments. Checks if AI comments are accurate or hallucinated by cross-referencing with actual code changes.

**Prerequisites:** Requires `gh` CLI installed and authenticated.

**Usage:**
```
/validate-pr                                          # the current branch's PR
/validate-pr 123
/validate-pr https://github.com/owner/repo/pull/123
```

The skill and the command behave the same. Install one: Claude Code also exposes skills as slash commands, so with both you get two `/validate-pr` entries.

## Installation

### Skills (skills.sh)

Install via the skills CLI:

```bash
npx skills add arraydude/agent-skills --skill react-query-best-practices
npx skills add arraydude/agent-skills --skill smc-crt-analysis
npx skills add arraydude/agent-skills --skill feature-workflow
npx skills add arraydude/agent-skills --skill validate-pr
npx skills add arraydude/agent-skills --skill qa-verify
npx skills add arraydude/agent-skills --skill babysit-pr

# babysit-pr runs qa-verify, so install them together
npx skills add arraydude/agent-skills --skill qa-verify --skill babysit-pr

# List what the repo ships
npx skills add arraydude/agent-skills --list
```

### Claude Code Commands

Copy the `.claude/commands/` directory to your project:

```bash
# Copy all commands
cp -r .claude/commands/ /path/to/your/project/.claude/commands/

# Or copy a specific command
cp .claude/commands/validate-pr.md /path/to/your/project/.claude/commands/
```

## Usage

**Model-invoked skills** are used when the agent detects a relevant task:
```
Help me set up React Query with proper caching
Review this useQuery implementation
How should I handle WebSocket updates with React Query?
```

**Hand-invoked skills** and **commands** run only from their `/` command:
```
/qa-verify
/babysit-pr 123 --skip-qa
/validate-pr 123
```

## Structure

### Skills (skills.sh format)

Every skill has a `SKILL.md` with the agent's instructions. Beyond that:
- **Rule-based skills** add `rules/` (one file per rule, with examples) and `AGENTS.md` (all rules compiled, rebuilt whenever a rule changes).
- **Workflow skills** (`qa-verify`, `babysit-pr`) keep their steps in `SKILL.md` and move branch-specific reference into sibling files (e.g. `babysit-pr/route-unrelated.md`).

### Claude Code Commands

Commands are stored in `.claude/commands/` as Markdown files with optional frontmatter:
- `*.md` - Command file with instructions
- Frontmatter can specify `allowed-tools` and other metadata

## License

MIT
