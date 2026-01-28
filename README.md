# Agent Skills

A collection of skills for AI coding agents. Skills are packaged instructions and scripts that extend agent capabilities.

Skills follow the [Agent Skills](https://skills.sh/) format.

## Available Skills

### validate-pr

Validate AI-generated PR review comments. Checks if AI comments are accurate or hallucinated by cross-referencing with actual code changes.

**Use when:**
- Reviewing PRs that have AI-generated comments
- Verifying if AI suggestions are valid or hallucinations
- Prioritizing which review comments to address

**Usage:**
```
/validate-pr 123
/validate-pr https://github.com/owner/repo/pull/123
```

---

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

## Installation

```bash
npx skills add arraydude/agent-skills
```

Or install a specific skill:

```bash
npx skills add arraydude/agent-skills/react-query-best-practices
```

## Usage

Skills are automatically available once installed. The agent will use them when relevant tasks are detected.

**Examples:**
```
Help me set up React Query with proper caching
```
```
Review this useQuery implementation
```
```
How should I handle WebSocket updates with React Query?
```

## Skill Structure

Each skill contains:
- `SKILL.md` - Instructions for the agent
- `AGENTS.md` - Full compiled document with all rules expanded
- `rules/` - Individual rule files with code examples
- `metadata.json` - Version and reference information

## License

MIT
