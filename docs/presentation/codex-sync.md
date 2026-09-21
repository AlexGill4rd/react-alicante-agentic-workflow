# React Alicante Workshop — Notes

## Syncing Codex with Claude Code

If you also have Codex installed, point it at the same definitions instead of duplicating them — run from the repo root:

```bash
# Agents/instructions: Codex reads AGENTS.md natively (already in this repo,
# pointing at .claude/agents/) — no extra step needed.

# Skills: Codex discovers skills from .agents/skills/, not .claude/skills/.
ln -s ../.claude/skills .agents/skills
```
