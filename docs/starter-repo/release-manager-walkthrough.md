# Release-manager walkthrough

Draft. The steps are written after the rehearsal.

Goal: release tickets 1 and 2 to Production with the `release-manager` agent.
Both tickets must be merged into `dev` first.

## Start

Open a terminal in VS Code, not the Claude chat. Run it from the repo root:

```bash
claude --agent release-manager "next minor"
```

## Steps

To do: each phase, what the agent asks, and what you answer.

## Merge the release pull request

To do: merge with **Create a merge commit**, not squash.

## Production database

To do: link to Production, run the dry run and the push, link back to QA.

## Done

To do: what you should see in Production and on GitHub.
