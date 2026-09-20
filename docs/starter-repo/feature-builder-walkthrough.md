# Feature-builder walkthrough

Draft. The steps are written after the rehearsal.

Goal: build tickets 1 and 2 with the `feature-builder` agent. Ticket 3 is
optional, if there is time.

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
