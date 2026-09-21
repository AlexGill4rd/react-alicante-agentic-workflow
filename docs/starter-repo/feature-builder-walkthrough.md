# Feature-builder walkthrough

Draft. The steps are written after the rehearsal.

Goal: build tickets 1 and 2 with the `feature-builder` agent. Ticket 3 is
optional, if there is time.

## Before you start

Stop any dev server that is still running, including old ones you forgot. The
agent starts its own, and two servers can clash on the same port.

- Press `Ctrl+C` in the terminal where `pnpm dev` runs.
- Still running? Stop all Node programs (macOS and Linux). This also stops other
  Node programs you have open.

  ```bash
  killall -9 node
  ```

## Start

The first ticket is **Add a Speakers page**. Open a terminal in VS Code, not the
Claude chat. Check that you are on `dev` and that `git status` is clean. Then run
the agent from the repo root, with the ticket number in quotes:

```bash
claude --agent feature-builder "#1"
```

Use the number of that ticket in your fork's **Issues** tab. It is normally #1.

## Steps

1. Claude Code asks if you trust the folder. The repo pre-approves two tools in
   `.claude/settings.json`: taking screenshots in the browser, and `gh pr`
   commands. Choose **Yes, I trust this folder**.

   ![Claude Code asking to trust the folder](images/feature-builder-trust.png)

2. Claude Code asks about the MCP server from `.mcp.json`. It is Playwright: the
   agent uses it to test your feature in a browser. Choose **Use this MCP
   server**.

   ![Claude Code asking to use the MCP server](images/feature-builder-mcp.png)

To do: the next stops, what the agent asks, and what you answer.

## Merge the pull request

To do: merge with **Squash and merge**, then delete the branch.

## Repeat for ticket 2

```bash
claude --agent feature-builder "#2"
```

## Done

To do: what you should see when both tickets are merged into `dev`.
