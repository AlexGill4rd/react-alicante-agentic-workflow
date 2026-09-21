# Feature-builder walkthrough

Draft. The steps are written after the rehearsal.

Goal: build tickets 1 and 2 with the `feature-builder` agent. Ticket 3 is
optional, if there is time.

## Before you start

Stop any dev server that is still running, including old ones you forgot to
close. The agent starts its own, and two servers can clash on the same port.

- In the terminal where `pnpm dev` runs, press `Ctrl+C`.
- Still running? Stop whatever uses port 3000 (macOS and Linux):

  ```bash
  kill $(lsof -ti :3000)
  ```

- Last resort (macOS and Linux): stop every Node program on your computer.

  ```bash
  killall -9 node
  ```

  This also stops other Node programs you have open, for example another
  terminal running Claude Code if you installed it with npm. Use it only when
  the steps above did not work.

## Start

Run it from the repo root, in a terminal. Add the ticket number in quotes:

```bash
claude --agent feature-builder "#1"
```

Always start the agent with `claude --agent`. Asking a normal session to "run
feature-builder" does not work.

## Steps

To do: what the agent asks, where it stops, and what you answer.

## Merge the pull request

To do: merge with **Squash and merge**, then delete the branch.

## Repeat for ticket 2

```bash
claude --agent feature-builder "#2"
```

## Done

To do: what you should see when both tickets are merged into `dev`.
