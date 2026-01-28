# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This repository contains AI agent skills and commands in two formats:
- **Skills (skills.sh format)**: Auto-activate when relevant tasks detected, installed via `npx skills add`
- **Claude Code Commands**: Explicit invocation via `/command-name`, installed by copying `.claude/commands/`

## Repository Structure

```
skills/                          # skills.sh format skills
  <skill-name>/
    SKILL.md                     # Instructions for the agent (frontmatter + content)
    AGENTS.md                    # Full compiled document with all rules expanded
    rules/                       # Individual rule files with code examples
    metadata.json                # Version and reference information

.claude/commands/                # Claude Code native commands
  <command-name>.md              # Command file with frontmatter and instructions
```

## Creating New Skills (skills.sh format)

Skills follow the [skills.sh](https://skills.sh/) format:

1. Create directory under `skills/<skill-name>/`
2. `SKILL.md` - Main entry point with YAML frontmatter containing `name`, `description`, `license`, and `metadata`
3. `metadata.json` - Version, organization, abstract, and reference URLs
4. `rules/` - Individual rule files with brief explanation + incorrect/correct code examples
5. `AGENTS.md` - Compiled document containing all rules expanded (for distribution)

## Creating New Claude Code Commands

Commands are Markdown files in `.claude/commands/`:

1. Create `.claude/commands/<command-name>.md`
2. Add YAML frontmatter with `description` field
3. Use `$ARGUMENTS` placeholder for user input
4. Include input validation and clear error messages
5. Document prerequisites (e.g., required CLI tools)

Example frontmatter:
```yaml
---
description: Brief description shown in command list
---
```
