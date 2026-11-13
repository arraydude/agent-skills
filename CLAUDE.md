# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This repository contains AI agent skills in the skills.sh format, installed via `npx skills add`. Claude Code exposes every skill as a slash command, so anything meant to run from `/name` is a hand-invoked skill (step 2 below), not a `.claude/commands/` file.

## Repository Structure

```
skills/                          # skills.sh format skills (source of truth)
  <skill-name>/
    SKILL.md                     # Instructions for the agent (frontmatter + content)
    AGENTS.md                    # Rule-based skills: compiled document, all rules expanded
    rules/                       # Rule-based skills: one file per rule
    <topic>.md                   # Workflow skills: reference disclosed from SKILL.md
    agents/openai.yaml           # Optional: Codex display name and invocation policy

.agents/skills/<skill-name>      # Symlink -> ../../skills/<skill-name>
.claude/skills/<skill-name>      # Symlink -> ../../skills/<skill-name>
```

## Creating New Skills (skills.sh format)

Skills follow the [skills.sh](https://skills.sh/) format and come in two shapes:

- **Rule-based** (`react-query-best-practices`, `validate-pr`): a body of guidance the agent consults. `SKILL.md` indexes the rules, `rules/` holds one file per rule (brief explanation + incorrect/correct examples), and `AGENTS.md` compiles them all for distribution. Any change to a rule file updates `AGENTS.md` and the `SKILL.md` index in the same commit.
- **Workflow** (`qa-verify`, `babysit-pr`): ordered steps the agent executes, each ending on a checkable completion criterion. `SKILL.md` holds the steps; reference that only some branches need moves to a sibling `<topic>.md` linked from the step that uses it. No `rules/` or `AGENTS.md`.

To add one:

1. Create `skills/<skill-name>/` with a `SKILL.md` whose YAML frontmatter has `name`, `description`, `license: MIT`, and `metadata` (`author`, `version`).
2. Pick the invocation: keep a trigger-rich `description` when the agent should fire the skill on its own; set `disable-model-invocation: true` (and a one-line, human-facing `description`) when it only runs by hand. Mirror a hand-run skill in `agents/openai.yaml` with `allow_implicit_invocation: false`.
3. Keep skills project-agnostic: this repo is public. Read project specifics (commands, logins, channels) from the target repo's `AGENTS.md` / `CLAUDE.md` instead of hard-coding them.
4. Symlink it: `ln -s ../../skills/<skill-name> .agents/skills/<skill-name>` and the same under `.claude/skills/`.
5. Add it to `README.md`: a section and an install line.
