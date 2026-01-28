# Agent Skills

A collection of skills and commands for AI coding agents.

## Skills (skills.sh format)

Skills auto-activate when relevant tasks are detected. They follow the [Agent Skills](https://skills.sh/) format.

### react-query-best-practices

React Query (TanStack Query) best practices, patterns, and troubleshooting. Based on TkDodo's comprehensive blog series.

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

## Claude Code Commands

Commands require explicit invocation via `/command-name`. They use Claude Code's native command format.

### validate-pr

Validate AI-generated PR review comments. Checks if AI comments are accurate or hallucinated by cross-referencing with actual code changes.

**Prerequisites:** Requires `gh` CLI installed and authenticated.

**Usage:**
```
/validate-pr 123
/validate-pr https://github.com/owner/repo/pull/123
```

## Installation

### Skills (skills.sh)

Install via the skills CLI:

```bash
npx skills add arraydude/agent-skills/react-query-best-practices
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

**Skills** are automatically available once installed. The agent will use them when relevant tasks are detected:
```
Help me set up React Query with proper caching
Review this useQuery implementation
How should I handle WebSocket updates with React Query?
```

**Commands** require explicit invocation with the `/` prefix:
```
/validate-pr 123
```

## Structure

### Skills (skills.sh format)

Each skill contains:
- `SKILL.md` - Instructions for the agent
- `AGENTS.md` - Full compiled document with all rules expanded
- `rules/` - Individual rule files with code examples
- `metadata.json` - Version and reference information

### Claude Code Commands

Commands are stored in `.claude/commands/` as Markdown files with optional frontmatter:
- `*.md` - Command file with instructions
- Frontmatter can specify `allowed-tools` and other metadata

## License

MIT
