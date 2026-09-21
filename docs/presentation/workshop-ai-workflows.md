# Workshop: AI Workflows with Claude Code

### For Senior Engineers — Philomath Academy Codebase

**Duration:** 90 minutes

---

## Overview

This workshop shows how Claude Code's three primitives — **Rules**, **Skills**, and **Agents** — work together to turn Claude from a "smart autocomplete" into a proper workflow engine embedded in your engineering culture. Everything you'll see is already running in this codebase.

---

## Part 1 — The Mental Model (15 min)

### Why three primitives?

Most developers use AI by writing long prompts. The problem: prompts don't compose, they don't enforce constraints, and they don't accumulate knowledge. Rules, Skills, and Agents are the architectural answer to that.

```
RULES  ─── always-on guardrails (never need to invoke)
SKILLS ─── deterministic, single-purpose tasks (slash commands)
AGENTS ─── orchestrators for multi-step workflows (delegate to skills)
```

### The filesystem is the interface

```
.claude/
├── rules/      # 10 markdown files — auto-loaded by file path
├── skills/     # 26 skill definitions — invoked as /skill-name
└── agents/     # 14 agent definitions — invoked by name
```

No code. No plugin system. The convention is the contract. Every capability in this AI setup is readable, diffable, and PR-reviewable just like any other source file.

### Live: discover everything available right now

```
/what-can-you-do
```

This skill reads `.claude/skills/` and `.claude/agents/` dynamically and lists every capability. It's the help menu, auto-generated from your own codebase. The fact that it's a skill itself — not a hardcoded command — is the point.

---

## Part 2 — Rules: Convention Enforcement Without Prompting (15 min)

### What rules are

Rules live in `.claude/rules/*.md`. Each file has a `paths:` frontmatter that scopes it to specific directories. Claude loads the relevant rules automatically based on what files it's about to touch — no invocation required.

```yaml
---
paths:
  - "apps/academy/src/components/**"
  - "apps/academy/src/app/[locale]/**/_components/**"
---
```

The content is plain English conventions. No code. Just constraints.

### The 10 rules and what they guard

| Rule               | Guards                                                                             |
| ------------------ | ---------------------------------------------------------------------------------- |
| `components.md`    | Atomic Design tiers, SRP, internal order (hooks → handlers → render)               |
| `styling.md`       | No hardcoded colors, semantic tokens required, no `!important`                     |
| `code-quality.md`  | No `any`, no `console.log`, no unused vars                                         |
| `architecture.md`  | Layer boundaries, server/client split, one-way dependency flow                     |
| `i18n.md`          | All user-facing strings via `useTranslations`, no hardcoded display text           |
| `testing.md`       | Co-located tests, snapshot + behavioral assertions required                        |
| `git.md`           | Branch naming `feature-<issue>-<desc>`, commit format `<type>(<scope>): <subject>` |
| `server-client.md` | `'use client'` only if hooks/events/browser APIs genuinely needed                  |
| `data-patterns.md` | Static data in `src/data/`, never inline in components                             |
| `analytics.md`     | Event naming and payload structure                                                 |

### Key insight: rules vs. CLAUDE.md

`CLAUDE.md` is the full project onboarding document — read once by a developer or by Claude at the start of a session. Rules are the _always-active layer_ — they fire automatically, file by file, as work happens.

|             | CLAUDE.md             | Rules             |
| ----------- | --------------------- | ----------------- |
| Purpose     | Documentation         | Automation        |
| When loaded | Session start         | Per file touched  |
| Scope       | Whole project         | Path-scoped       |
| Invocation  | None (always present) | None (auto-fired) |

### How rules are structured

Every rule file is markdown with frontmatter. Look at `.claude/rules/styling.md` — it defines not just what to do but what NOT to do, and why. The `Why:` context is what makes rules maintainable: a future developer reading it knows whether the constraint is still load-bearing.

---

### Exercises — Part 2

**Exercise 2.1 — Find the rule boundary (2 min)**
Open `.claude/rules/server-client.md`. Find the rule about `'use client'`. Now open any organism component (`src/components/organisms/`). Ask Claude: "Does this component need `'use client'`?" Notice how Claude reasons from the rule, not from general React knowledge.

**Exercise 2.2 — Trigger a rule violation (5 min)**
In any component, add:

```tsx
style={{ color: '#5bbacb' }}
```

Ask Claude to review the file. Observe which rule fires, how specific the feedback is, and how the suggested fix reads. Then revert the change.

**Exercise 2.3 — Does Atomic Design get enforced? (5 min)**
Run `/new-component TestBadge` but give an invalid tier — type `pages` instead of a valid one (`atoms`, `molecules`, `organisms`, `templates`). What does Claude do? Then run `/review-component` on any existing component and look at checklist item 1. Which part of the skill catches a wrong tier — the `Prerequisites`, the `Workflow`, or the `Constraints`? What does this tell you about where Atomic Design enforcement actually lives?

---

## Part 3 — Skills: Deterministic Single-Purpose Automation (25 min)

### Anatomy of a skill

Every skill is a markdown file with YAML frontmatter. Open `.claude/skills/engineering-new-component/SKILL.md`:

```yaml
---
name: new-component
description: Scaffold a new React component following atomic design and project conventions.
metadata:
  domain: engineering
  trigger: manual
  after: []
argument-hint: "<ComponentName> <tier|route>"
---
```

Then the file has six sections:

| Section         | Purpose                                            |
| --------------- | -------------------------------------------------- |
| `When to use`   | Routing decision — when should this skill fire?    |
| `Inputs`        | Named arguments with validation rules              |
| `Prerequisites` | What must be true before starting                  |
| `Workflow`      | Numbered, imperative steps                         |
| `Constraints`   | What NOT to do — equally important as the workflow |
| `Output`        | Exact files produced                               |
| `Verification`  | Checklist Claude runs after completing             |

**The Workflow section is imperative, not suggestive:**

```markdown
## Workflow

1. Determine location: shared or page-specific
2. Create $1.tsx with 'use client' only if needed
3. Define a $1Props interface — no any
4. Use useTranslations for all user-facing strings
5. Create $1.test.tsx alongside (snapshot + behavioral)
6. Create $1.module.scss only if complex styles needed
```

**The Constraints section is equally important — it encodes what NOT to do:**

```markdown
## Constraints

- No inline styles
- No hardcoded colors
- No skipping the test file
- No unnecessary 'use client'
- No any types
- No data in components
```

### The five skill categories

| Category     | Skills                                                                                                                                                                                                                                       | Trigger        |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| **Scaffold** | `/new-component`, `/new-page`, `/new-hook`, `/new-data-file`, `/new-server-action`, `/new-test`                                                                                                                                              | manual         |
| **Quality**  | `/review-component`, `/check-quality`, `/audit-i18n`, `/audit-test-coverage`                                                                                                                                                                 | auto or manual |
| **Refactor** | `/refactorer`, `/migrate-imports`, `/harden-security`                                                                                                                                                                                        | manual         |
| **Product**  | `/create-pr-description`                                                                                                                                                                                                                     | manual         |
| **Release**  | `/release-create-branch`, `/release-bump-version`, `/release-generate-changelog`, `/release-open-pr`, `/release-check-env-vars`, `/release-qa-bugs`, `/release-pre-merge`, `/release-post-merge`, `/release-fix-bugs`, `/release-db-migrate` | manual         |

### Auto-triggered skills

Some skills have `trigger: auto`. Claude invokes these automatically after a related task completes — without the user asking:

```yaml
# .claude/skills/engineering-review-component/SKILL.md
metadata:
  trigger: auto
```

After scaffolding a component, Claude auto-runs the 11-item convention checklist. The developer gets a Pass/Fail verdict without asking for a review. The quality gate is structural, not dependent on the developer remembering to ask.

### The `after` field: explicit dependency ordering

```yaml
after: [engineering-new-component, engineering-new-test]
```

This tells Claude that `/review-component` should only run after the component and test files exist. It's a dependency graph encoded in skill metadata. Think of it as a Makefile for workflows.

### The review checklist (11 items)

Open `.claude/skills/engineering-review-component/SKILL.md`. The 11 items:

1. Atomic Design tier placement
2. Naming (PascalCase, default export matches filename)
3. TypeScript (`FC<Props>`, no `any`)
4. Imports (`@/` aliases, no deep relative paths)
5. Styling (single approach, no inline styles)
6. Tokens (no hardcoded colors, semantic tokens only)
7. i18n (all user-facing text via `useTranslations`)
8. SRP (one thing only, extract if growing)
9. Client directive (`'use client'` justified or absent)
10. Code quality (no `console.log`, correct internal order)
11. Tests (co-located, snapshot + behavioral)

Output is always: Pass/Fail per item → overall verdict: **Approve / Request Changes / Needs Discussion**.

### Writing your own skill

The `SKILL_TEMPLATE.md` is the contract:

```markdown
---
name: my-skill
description: One precise sentence — used for routing decisions.
metadata:
  domain: engineering
  trigger: manual
  after: []
---

## When to use

## Inputs

## Prerequisites

## Workflow

(numbered, imperative steps — not suggestions)

## Constraints

(what NOT to do — equally important as Workflow)

## Output

## Verification
```

**Design principle:** A skill should do exactly one thing. `/new-component` does not run tests or lint — it scaffolds. Composition happens at the agent level.

---

### Exercises — Part 3

**Exercise 3.1 — Scaffold a component and read the output (5 min)**

```
/new-component WorkshopCard molecules
```

Read every file Claude creates. For each decision (the `'use client'` absence, the `FC<WorkshopCardProps>` interface, the mock in the test file), trace it back to the specific line in the skill's `## Workflow` or `## Constraints` section that caused it.

**Exercise 3.2 — Read the full skill file (3 min)**
Open `.claude/skills/engineering-new-server-action/SKILL.md`. List:

- What does the `Prerequisites` section check before creating any file?
- What validation library does the `Workflow` enforce?
- What specific files does `Output` guarantee will exist?

**Exercise 3.3 — Find the gap between skill and constraint (5 min)**
Run:

```
/new-component PricingTable organisms
```

When Claude creates the component, intentionally ask it to add pricing data as an inline array inside the component. Observe what happens. Which constraint blocks this? Where does that constraint live in the skill file?

**Exercise 3.4 — Use the auto-review skill deliberately (5 min)**
Open any existing organism component. Introduce two violations:

1. Import a component using a relative path (`../../atoms/Button`) instead of `@/components/atoms/Button`
2. Add a `console.log` somewhere in the component body

Then run:

```
/review-component [filepath]
```

Read the exact Pass/Fail output. Notice that the skill reads the actual file — it doesn't hallucinate. Revert your changes.

**Exercise 3.5 — Design a skill (10 min, pair exercise)**
Pick a repetitive task from your current workflow. Write a `SKILL.md` for it using the template. Share with a partner and review each other's `Constraints` sections. Are the constraints specific enough to prevent a wrong output? Would someone else, reading only the skill file, produce the same result you're imagining?

---

## Part 4 — Agents: Orchestrating Multi-Step Workflows (20 min)

### What agents are

Agents are autonomous subprocesses that handle complex, multi-step tasks. They are not skills — they coordinate skills. The key distinction:

|                   | Skills                       | Agents                            |
| ----------------- | ---------------------------- | --------------------------------- |
| Scope             | Single deterministic task    | Multi-step workflow               |
| Execution         | Writes/modifies files        | Delegates to skills               |
| Human checkpoints | Implicit (verification step) | Explicit, enforced with `⏸️ WAIT` |
| Invocation        | `/skill-name`                | "Run the X agent"                 |
| Role              | Worker                       | Coordinator                       |

### The 14 agents

| Domain         | Agents                                                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Planning**   | `feature-planner`                                                                                                                          |
| **Quality**    | `code-reviewer`, `accessibility-auditor`, `performance-optimizer`, `security-auditor`, `production-readiness-auditor`, `product-audit-seo` |
| **Operations** | `release-manager`, `devops`, `database-manager`                                                                                            |
| **Debugging**  | `bug-triager`, `sentry-debugger`                                                                                                           |
| **Product**    | `product-github-issue-manager`                                                                                                             |

### A note on the `color` field

If you look at agents created via the Claude Code `/agents` interactive command (not hand-authored like ours), you may see a `color:` frontmatter field:

```yaml
---
name: my-agent
description: ...
color: blue
---
```

This is a **cosmetic UI feature** — it sets the label color for the agent in the Claude Code sidebar and picker. It has no effect on behavior. Our agents were hand-authored and don't use it; if you create one via `/agents` in the IDE, you'll see a color picker in the wizard.

### Deep dive: feature-planner

Open `.claude/agents/feature-planner.md`.

The agent has `role: planner`. Before writing a plan, it asks five questions:

1. **Who** is affected? (learner, instructor, admin, anonymous)
2. **What** changes exactly? (new UI, data, route, action)
3. **Where** does it live? (which page, which Atomic Design tier)
4. **Why** does it matter? (user value — needed for acceptance criteria)
5. **What's out of scope?** (explicit exclusions)

Then it maps the feature to project layers and produces a dependency-ordered execution plan:

```markdown
## Execution Plan: Progress Indicator

Phase 1 — Data: /new-data-file progressConfig
Phase 2 — Scaffold:
/new-component ProgressBar atoms
/new-component ProgressIndicator molecules
Phase 3 — i18n: /audit-i18n
Phase 4 — Tests: /new-test ProgressBar, /new-test ProgressIndicator
Phase 5 — Review: code-reviewer, accessibility-auditor, /check-quality
Phase 6 — PR: /create-pr-description
```

**End-to-end tests:** Phase 4 writes unit tests. If the feature touches a critical flow (auth, payment, checkout, anything security-related), `feature-builder` files a **separate follow-up ticket** for regression and e2e tests. It does not add e2e tests to the feature PR, and the PR does not wait for that ticket. Ordinary features get no e2e ticket.

**Critical constraint:** The agent presents the plan. The user approves. Only then does execution begin. The agent itself never calls a skill — it hands off to the user or a downstream agent.

### Deep dive: release-manager

Open `.claude/agents/release-manager.md`.

This is a phased, human-checkpointed workflow. Every `⏸️ WAIT` marks an irreversible action:

```
PHASE 1 — Code Freeze
  ⏸️ WAIT: "All features merged to dev? Reply 'yes'"
  → /release-create-branch v1.5.0

PHASE 2 — Version & Changelog
  → /release-bump-version v1.5.0
  → /release-generate-changelog v1.5.0

PHASE 3 — Open PR
  → /release-open-pr v1.5.0
  ⏸️ WAIT: "Come back when QA is done"

PHASE 4 — QA
  → /release-check-env-vars (blocks until Vercel vars confirmed)
  → /release-qa-bugs (if bugs reported)
  ⏸️ WAIT: "QA complete, all fix PRs merged? Reply 'yes'"

PHASE 5 — Pre-Merge
  → /release-pre-merge
  ⏸️ WAIT: "PR merged to main? Confirm"

PHASE 6 — Post-Merge
  → /release-post-merge (tag, GitHub release, merge main→dev)
```

Each phase delegates to a separate skill. The agent is the orchestrator. Every `⏸️ WAIT` corresponds to a human decision that cannot be automated without risk.

### Design principles at work

**Delegation, not re-implementation**
`code-reviewer` doesn't re-implement the 11-item convention checklist — it calls `/review-component`. Change the skill once; all agents that call it get the update automatically.

**Constraint-driven design**
Every agent has a `## Constraints` section as detailed as the execution process:

- `release-manager`: "Do NOT create fix branches from `dev` — always from the release branch"
- `feature-planner`: "Do NOT add steps that have no matching skill or agent"
- `bug-triager`: "Proposes fixes, does not commit them"

These encode institutional memory. The `Why:` behind each constraint is what makes them maintainable.

**Explicit Boundaries**
Agents have `## Boundaries` sections that define the hard edges:

- `feature-planner`: "Do NOT write code, scaffold files, or run skills"
- `release-manager`: "Do NOT merge the PR — leave it open for QA"
- `database-manager`: "Do NOT apply migrations to Production without explicit user confirmation"

This prevents over-automation. Humans hold the keys to irreversible actions.

### Merging: best practices

The agents never merge. The human does, so the human needs to pick the right option.

**Feature PR into `dev` — Squash and merge**

- One PR gives one commit on `dev`.
- The PR title becomes the commit message, so it must read `type(scope): subject`. The changelog is built from these commits.
- Merge only when CI is green.
- Delete the branch after merging.
- Keep PRs small and focused.

**Release PR into `main` — Create a merge commit**

- Never squash and never rebase. A squash gives the tag a commit with no link to `dev`, and the next changelog lists old commits again.
- Only the release branch goes to `main`. No direct commits.
- Merge after QA passed and CI is green, and after the Production migrations are applied.
- Tag and publish the release right after, then merge `main` back to `dev`.

**Where the skills say it**

- `feature-builder` tells the user to squash and delete the branch.
- `release-qa-bugs` says the same for fix PRs into the release branch.
- `release-pre-merge` tells the user to use a merge commit for the release PR.

### Things to improve next

Agent workflows are never finished. Every real release shows a small gap, and the fix goes into the skill, so the next run is better. Ideas we have not built yet:

- **Clean up the release branch.** After the tag and the merge back to `dev`, `release-post-merge` could offer to delete the release branch, locally and on origin. It deletes a remote branch, so it needs its own confirmation step.
- **Check the merge method.** Today the skill only tells the user which button to click. A later version could check the result, for example that the tag commit has two parents, and warn if not.
- **Changelog range.** `release-generate-changelog` could start from the merge-back commit and not only from the last tag, so a squash never repeats old commits.
- **Ignore the working files.** The state files of the agents (`release-state.md`, `feature-state.md`) belong in `.gitignore`. We found this only when a skill stopped on a dirty tree. Done.
- **Skip the steps a release does not need.** A release with only docs has no migration, no new environment variable and no feature to test. The agent could compare the changed files since the last tag and offer to skip: the database step if nothing in `supabase/migrations/` changed, the env variable check if `.env.example` did not change, and the preview testing if only docs changed. It should always ask first, and it must never skip the merge and the tag. Git shows that files did not change, not that Production is up to date, so the dry run is still the safe choice.
- **A verifier agent.** Today an agent checks its own work with a checklist. A separate, read-only agent could check that the process was followed, starting fresh and looking only at git and GitHub: the release PR used a merge commit, the tag is on `main`, `dev` and `main` have the same content, the state file is gone, the QA milestone is closed. It cannot check human steps, such as testing the preview.

The lesson for the workshop: the tooling is part of the codebase. You read it, run it, and change it with normal PRs. Each release is a test of the skills.

---

### Exercises — Part 4

**Exercise 4.1 — Read the agent contract (3 min)**
Open `.claude/agents/bug-triager.md`. Find the `## Boundaries` section. Answer:

- What does the agent do vs. what does it explicitly refuse to do?
- At which point does it stop and hand back to the human?
- Which skills does it delegate to?

**Exercise 4.2 — Trace a release checkpoint (5 min)**
Open `.claude/agents/release-manager.md`. List every `⏸️ WAIT` in order. For each one, answer:

1. What irreversible action does this checkpoint guard?
2. What would go wrong if this checkpoint were skipped?

**Exercise 4.3 — Run the feature-planner on a real feature (8 min)**
Ask Claude:

> "Run the feature-planner agent. I want to add a skill completion badge to the learner's profile page."

Let the agent ask its five clarifying questions. Answer them. Read the execution plan it produces. Check: does every step in the plan map to a real skill or agent? Are there any steps it invented that don't exist?

**Exercise 4.4 — Compare agent roles (5 min)**
Look at the frontmatter of three agents: `feature-planner` (`role: planner`), `release-manager` (`role: hybrid`), `accessibility-auditor` (`role: reviewer`).

For each role, answer:

- Does this agent write code?
- Does this agent call skills?
- Does this agent wait for human confirmation?

What would break if `feature-planner` were changed to `role: hybrid` and started executing skills automatically?

---

## Part 5 — Complete Workflow Walkthrough (15 min)

### Scenario A: bug report

> "Form submission fails on mobile — contact form throws on iOS Safari"

```
1. User: "Run the bug-triager agent on issue #142"

2. Agent asks:
   - Error message or stack trace?
   - Reproduction steps?
   - Affected since which release?

3. Agent investigates:
   - Reads ContactForm.tsx
   - Reads the server action it calls
   - Checks recent commits to those files
   - Identifies root cause: useFormValidation accesses
     navigator.userAgent synchronously before hydration

4. Output:
   Root cause: SSR/hydration mismatch
   Proposed fix: guard with typeof window !== 'undefined'
   NOT applied — agent reports, human decides

5. User: "Apply the fix"

6. Claude applies diff, runs pnpm type-check, commits

7. Agent suggests: /new-test for the SSR edge case
```

The agent does the forensics. The human makes the commit decision. The skill handles the test.

### Scenario B: new feature

> "Add a learning streak counter to the dashboard"

```
1. User: "Run the feature-planner agent for a streak counter"

2. Agent asks five questions → user answers:
   - Who: learners only
   - What: visual day-streak, persisted in Supabase
   - Where: dashboard organisms
   - Why: increase daily return rate
   - Out of scope: leaderboards, notifications

3. Agent produces execution plan:
   Phase 1 — Schema: database-manager (new streaks table + RLS)
   Phase 2 — Scaffold:
     /new-hook useStreak
     /new-component StreakCounter organisms
   Phase 3 — i18n: /audit-i18n
   Phase 4 — Tests: /new-test useStreak, /new-test StreakCounter
   Phase 5 — Review: code-reviewer, accessibility-auditor
   Phase 6 — PR: /create-pr-description

4. User approves → execution begins phase by phase
```

### The quality flywheel

Every feature passes the same gates — not because someone remembered to add them to a PR template, but because they're structural:

```
Scaffold new component
  → auto /review-component       (11-item checklist, Pass/Fail)
  → /audit-i18n                  (orphaned translation keys)
  → /new-test                    (co-located, snapshot + behavioral)
  → code-reviewer agent          (architecture + a11y + perf)
  → /check-quality               (linter + type-check + tests)
  → /create-pr-description       (structured PR body, Closes #issue)
```

The gates don't depend on a senior engineer catching everything in review. They fire automatically.

---

## Part 6 — Design Principles & Building Your Own (15 min)

### Six principles that make this work

**1. Single Responsibility per skill**
`/new-component` scaffolds. `/review-component` reviews. They never overlap. Three similar workflows belong in a skill; one skill doing three things belongs split into three.

**2. Explicit dependency ordering via `after:`**

```yaml
after: [engineering-new-component, engineering-new-test]
```

Skills declare what must exist before they can run. It's a build graph for workflows — no implicit ordering, no "run this first" in the prompt.

**3. Imperative, not suggestive**
"Run `pnpm type-check`" not "you might want to check types." Determinism is what makes skills composable without surprises. If the step is a suggestion, it belongs in documentation, not a skill.

**4. Constraints are equal citizens**
The `Constraints` section encodes institutional memory. Every constraint should be able to answer: "What went wrong the last time someone skipped this?" If it can't, it may not belong there.

**5. Human checkpoints at irreversible actions**
Pushing to `main`, merging a PR, applying a DB migration, creating a git tag — every irreversible action has a `⏸️ WAIT`. The rule: if undoing requires more than a `git revert`, a human must explicitly confirm.

**6. Rules auto-apply; skills require invocation; agents require intent**
This is the ergonomic ladder:

- You never invoke `components.md` — it just fires
- You invoke `/new-component` when you want to scaffold something
- You invoke `feature-planner` when you're starting something with unknown scope

Match the tool to the intent.

### Where to add your own

**New rule:** Add a `.md` file to `.claude/rules/` with `paths:` frontmatter. It auto-loads for any matching file path.

**New skill:** Create `.claude/skills/my-skill/SKILL.md` using `SKILL_TEMPLATE.md`. Invocable as `/my-skill`.

**New agent:** Create `.claude/agents/my-agent.md` using `AGENT_TEMPLATE.md`. Invoke by name in conversation.

### Design questions before writing a new skill

1. Does this do exactly one thing?
2. Is every step in `## Workflow` imperative — a command, not a suggestion?
3. What goes in `## Constraints` — what would a wrong implementation look like?
4. Does this depend on another skill completing first? → add `after:`
5. Should this fire automatically after a related task? → set `trigger: auto`
6. What does `## Verification` check to confirm success?

---

### Exercises — Part 6

**Exercise 6.1 — Identify the missing constraint (5 min)**
Open `.claude/skills/engineering-new-hook/SKILL.md`. Read the `## Constraints` section. Now think: what constraint is NOT there that could cause a wrong output? Write one additional constraint as a markdown bullet, with a `Why:` explanation.

**Exercise 6.2 — Write a real skill (15 min, pair exercise)**
Your team runs a repetitive task that isn't currently a skill. Pick one from this list or use your own:

- "Create a Supabase RLS policy for a new table"
- "Add a new Chakra theme token"
- "Add an analytics event to a user action"

Write a complete `SKILL.md` using the template. Include all seven sections. Swap with a partner — can they tell exactly what files will be created and what constraints prevent wrong output?

**Exercise 6.3 — Trace the dependency chain (5 min)**
Open `.claude/skills/engineering-review-component/SKILL.md`. This skill has `trigger: auto`.

- Which skills could trigger it?
- What happens if you call it before the component file exists? (Read the `## Prerequisites` section.)
- What's in `after:`? Why is it empty even though the skill should logically run after scaffold?

**Exercise 6.4 — Design a missing agent (10 min)**
There's no `onboarding-assistant` agent in this codebase. Design one using `AGENT_TEMPLATE.md`.

The agent should: welcome a new engineer to the codebase, run a set of orientation checks (CLAUDE.md read, rules understood, a component scaffolded successfully), and produce a short readiness report.

Write the `## Execution Process` section and the `## Constraints` section. What skills would it call? Where are the human checkpoints?

---

## Quick Reference

### Invocation syntax

```bash
# Skills (slash commands)
/new-component SkillCard molecules
/new-page dashboard
/new-hook useStreak
/new-test src/components/organisms/SkillCard/SkillCard.tsx
/review-component src/components/organisms/SkillCard/SkillCard.tsx
/audit-i18n
/check-quality
/create-pr-description
/what-can-you-do

# Agents (by name in conversation)
"Run the feature-planner agent for [feature description]"
"Start the release-manager agent for v1.5.0"
"Use the bug-triager agent on issue #142"
"Run the code-reviewer agent on ContactForm.tsx"
"Use the accessibility-auditor agent on the dashboard page"
```

### The `.claude/` directory at a glance

| Path                     | Contents                    | When active                   |
| ------------------------ | --------------------------- | ----------------------------- |
| `.claude/rules/`         | 10 convention files         | Auto, per file touched        |
| `.claude/skills/`        | 26 skill definitions        | On `/skill-name` invocation   |
| `.claude/agents/`        | 14 orchestrator definitions | On agent name in conversation |
| `.claude/settings.json`  | Bash command permissions    | Always — sandbox for Claude   |
| `apps/academy/CLAUDE.md` | Project onboarding document | Session start                 |

### Key files to read

| File                                | Why                                                   |
| ----------------------------------- | ----------------------------------------------------- |
| `.claude/skills/SKILL_TEMPLATE.md`  | The contract for authoring skills                     |
| `.claude/agents/AGENT_TEMPLATE.md`  | The contract for authoring agents                     |
| `.claude/agents/feature-planner.md` | Canonical planning agent — study the 5 questions      |
| `.claude/agents/release-manager.md` | Canonical orchestration agent — study the checkpoints |
| `.claude/rules/styling.md`          | Example of a constraint-rich rule with clear `Why:`   |
| `apps/academy/CLAUDE.md`            | Full project context — the source of truth            |

---

## All Exercises (Summary)

| #   | Title                                       | Time   | Type       |
| --- | ------------------------------------------- | ------ | ---------- |
| 2.1 | Find the rule boundary                      | 2 min  | Read + ask |
| 2.2 | Trigger a rule violation                    | 5 min  | Hands-on   |
| 2.3 | Does Atomic Design get enforced?            | 5 min  | Hands-on   |
| 3.1 | Scaffold a component and read the output    | 5 min  | Hands-on   |
| 3.2 | Read the full skill file                    | 3 min  | Read       |
| 3.3 | Find the constraint that blocks inline data | 5 min  | Hands-on   |
| 3.4 | Use the auto-review skill deliberately      | 5 min  | Hands-on   |
| 3.5 | Design a skill (pair)                       | 10 min | Design     |
| 4.1 | Read the agent contract                     | 3 min  | Read       |
| 4.2 | Trace a release checkpoint                  | 5 min  | Analysis   |
| 4.3 | Run the feature-planner on a real feature   | 8 min  | Live       |
| 4.4 | Compare agent roles                         | 5 min  | Analysis   |
| 6.1 | Identify the missing constraint             | 5 min  | Design     |
| 6.2 | Write a real skill (pair)                   | 15 min | Design     |
| 6.3 | Trace the dependency chain                  | 5 min  | Analysis   |
| 6.4 | Design a missing agent                      | 10 min | Design     |
