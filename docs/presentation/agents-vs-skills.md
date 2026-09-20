# Agents vs Skills — told through two real examples

Companion to [`workshop-ai-workflows.md`](./workshop-ai-workflows.md), which introduces the three primitives.

The one-line definitions ("skills are single-purpose, agents orchestrate") are true but not _useful_ — they don't tell you which one to write when you're staring at a new problem. This document draws the line using two things that already exist in this repo:

- `.claude/skills/engineering-refactorer/SKILL.md` — a **skill**
- `.claude/agents/release-manager.md` — an **agent**

---

## The two, side by side

|                             | `engineering-refactorer` (skill)                      | `release-manager` (agent)              |
| --------------------------- | ----------------------------------------------------- | -------------------------------------- |
| **Invoked as**              | `/engineering-refactorer <filepath>`                  | by name, usually delegated             |
| **Job**                     | Refactor one file/directory without changing behavior | Run an entire release, start to finish |
| **Duration**                | One sitting                                           | Days, across multiple sessions         |
| **State**                   | None                                                  | `.claude/release-state.md`             |
| **Human checkpoints**       | None — runs to completion                             | **Between every phase, mandatory**     |
| **Decides what runs next?** | No — its chain is fixed when it's written             | Yes — at runtime, from state           |
| **Resumable?**              | No. Just run it again                                 | Yes — `resume`                         |
| **Re-running is**           | Harmless                                              | Dangerous — it would restart a release |

---

## The test that actually decides it

> **Does it need to remember, and does a human need to approve partway through?**

Both yes → **agent**. Otherwise → **skill**.

Everything in the table above follows from that one question. State and human checkpoints are what force orchestration; orchestration is what makes something an agent. A long task is not automatically an agent — `engineering-refactorer` does a two-pass analysis, boundary checks, and a full rewrite, and it's still a skill, because you can run it start to finish unattended and running it twice costs you nothing.

---

## The nuance most people get wrong

**"Skills never call other skills"** is false. Look at `engineering-refactorer`'s own prerequisites:

> Run `audit-layout` on the same scope first, and apply its findings before proceeding to Pass 1. Extracting a block's existing structure into a named component without first removing dead wrappers just gives the redundancy a permanent name instead of removing it.

A skill calling a skill. And its frontmatter declares a whole chain:

```yaml
after:
  [
    audit-layout,
    engineering-refactor-backend,
    migrate-imports,
    review-component,
    check-quality,
  ]
```

So the line isn't _whether_ other things get called. It's **who decides, and when**:

- A **skill's** chain is fixed when the skill is _written_. Same input, same steps, every time. `engineering-refactorer` always runs the layout audit first — not because it reasoned its way there, but because someone learned the hard way that extracting before cleaning up bakes in the mess, and wrote that down.
- An **agent's** chain is decided at _runtime_, from state. `release-manager` reads `.claude/release-state.md`, sees which phases are done, and resumes from the first incomplete one. Which skill runs next is a function of where you are.

Determinism vs. judgment. That's the real boundary.

---

## What `release-manager` actually orchestrates

It delegates every step to a skill and owns none of the work itself:

```
release-check-env-vars ─┐
release-bump-version    │
release-create-branch   │
release-generate-changelog
release-open-pr         ├── 10 skills, sequenced by the agent
release-qa-bugs         │
release-fix-bugs        │
release-pre-merge       │
release-post-merge      ┘
```

Each of those is independently runnable. You can invoke `/release-generate-changelog` on its own without a release in flight. The agent adds three things the skills can't provide individually:

1. **Sequence** — knowing that env vars get checked before the branch is cut
2. **Memory** — `.claude/release-state.md`, so a release survives closing your laptop
3. **Refusal** — "Never proceeds past a phase without explicit human confirmation. Never merges to `main` directly."

That third one is the interesting one for a workshop. A meaningful part of an agent definition is what it _won't_ do. Guardrails are a first-class feature, not an afterthought.

---

## They fail in different ways

Worth teaching, because the mitigations are different.

**Skill failure = does its one job wrong.** Mitigated by prerequisites in the skill file. `engineering-refactorer` refuses to start blind: confirm the path exists, confirm a co-located test exists ("refactoring without tests is risky — warn if missing"), run `pnpm type-check` first and record pre-existing errors so they aren't counted as regressions. Cheap, local, checkable.

**Agent failure = skips a step silently, or resumes from the wrong state.** Both have happened here:

- **Scope crowding.** A detailed delegation prompt reads as _exhaustive_, so the agent optimizes for the prompt and drops its own standing checklist. Hit twice — `#400` Phase 4 (dropped the critical-flow e2e follow-up) and `#399` kickoff (dropped the entire phase workflow). Fix: delegation prompts are **pointers + overrides only**. Point at the plan; don't paste the plan.
- **Stale state.** `.claude/feature-state.md` holds one ticket at a time and is only deleted at Phase 7. `#400`'s PR merged with the file still at "Phase 5" — and it's the _first_ thing the next builder reads, so `#399` started by reading another ticket's progress. Fix: the builder now checks the state file's issue number before trusting it.

The general lesson, and the one worth putting on a slide:

> Any file that persists across runs needs an **ownership check**, not just a cleanup step. Cleanup steps get skipped. A guard cannot be.

---

## Writing a new one — which do you reach for?

| You want to…                                           | Write a…                    |
| ------------------------------------------------------ | --------------------------- |
| Enforce something on every edit, no invocation         | **Rule** (`.claude/rules/`) |
| Do one bounded job well, repeatably                    | **Skill**                   |
| Sequence several skills, hold state, stop for approval | **Agent**                   |

Start with a skill. Promote to an agent only when you find yourself needing to _remember_ between runs or _stop and ask_. Most things that feel agent-shaped are a skill plus a prerequisite line.

And note what all three have in common: they're markdown files in `.claude/`. No code, no plugin system, no registry. Diffable, reviewable in a PR, and correctable the moment they get something wrong — which, as the two failures above show, is the point.
