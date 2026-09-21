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

The agent stops at each **Breakpoint**. Read the report, then answer.

1. Choose **Yes, I trust this folder**.

   ![Claude Code asking to trust the folder](images/feature-builder-trust.png)

2. Choose **Use this MCP server**.

   ![Claude Code asking to use the MCP server](images/feature-builder-mcp.png)

3. The agent creates a branch and a progress file. No answer needed.

   ![The agent creating the branch and the progress file](images/feature-builder-branch.png)

4. Read the plan and type **confirm**. Ticket 1 is UI only, so the database
   phase is skipped.

   ![The agent's plan with the question Confirm to start](images/feature-builder-plan.png)

5. Wait. The agent reads the code and creates the files.

   ![The agent loading the page skill and reading the code](images/feature-builder-skills.png)

   ![The agent creating the files](images/feature-builder-creating.png)

6. **Breakpoint 3.** Type **confirm**. `/speakers` shows only the heading for now.

   ![The agent's report after the UI scaffold](images/feature-builder-breakpoint-scaffold.png)

   ![The Speakers page with only the heading](images/feature-builder-speakers-heading.png)

7. **Breakpoint 4.** Type **confirm**.

   ![The agent's report after the backend](images/feature-builder-breakpoint-backend.png)

8. Wait. The agent wires the page and runs the build.

   ![The agent wiring the page and running the build](images/feature-builder-wiring.png)

9. **Breakpoint 5.** Run `pnpm dev` again if the agent stopped it. Open
   `/speakers` and test the page.

   ![The agent's report after the scaffold is complete](images/feature-builder-breakpoint-scaffold-complete.png)

   ![The finished Speakers page on localhost](images/feature-builder-speakers-page.png)

10. The page works. Type **commit this**.

    ![The agent's report after the commit](images/feature-builder-committed.png)

11. Answer **yes** to push and open a draft PR. Approve the push. Find the PR in
    the **Pull requests** tab.

    ![The draft pull request with the phase status table](images/feature-builder-draft-pr.png)

12. **Breakpoint 6.** The agent wrote the tests. They are not committed yet.

    ![The agent's report after the i18n audit and the tests](images/feature-builder-breakpoint-tests.png)

13. Answer **yes** to commit the tests. **Breakpoint 7.** Type **push first,
    confirm**, so the review sees all changes.

    ![The agent's report after the quality gates](images/feature-builder-breakpoint-gates.png)

14. Approve the push: **Yes**.

    ![The push approval](images/feature-builder-push-approval.png)

15. Wait, about 5 minutes. The accessibility audit fixes what is in its own
    files. It asks what to do with problems in shared code: fix them in this PR,
    or file a follow-up ticket. Type **commit the fix, file a follow-up ticket for the rest**.

    ![The accessibility audit report](images/feature-builder-accessibility.png)

16. The agent commits the fix and files a follow-up ticket for the rest. Find it
    in the **Issues** tab, with the `accessibility` label. Fix what is yours, and
    file the rest as tickets. Then it asks to run the code review. Type
    **confirm**.

    ![The agent's follow-up ticket and the question about the code review](images/feature-builder-followup-ticket.png)

17. The code review runs with the project skill `/engineering-code-review`, which
    checks this repo's rules. It posts its report on the PR as a comment. Here
    the verdict is **Request changes**: the existing nav test has no case for the
    new Speakers link.

    ![The code review in the terminal](images/feature-builder-review-terminal.png)

    Open the PR to read the report.

    ![The code review posted on the PR](images/feature-builder-review-github.png)

    Two reviews exist. You can also run the second one yourself, for another
    opinion:

    - `/engineering-code-review`: this repo's own skill. It uses this repo's
      checklist and posts the report on the PR.
    - `/code-review`: built into Claude Code, not written for this repo.
      `/code-review ultra` is a bigger review in the cloud, and it is billed.

18. Answer **yes** to fix the finding. The agent adds the missing nav tests and
    checks that they fail without the nav link. Nothing is committed. Answer
    **yes** to commit.

    ![The agent adding the nav tests](images/feature-builder-fix-tests.png)

19. The agent asks to push both fix commits, and offers a re-review. You choose:
    type **push, ready for re-review**, or **push, skip re-review**. Approve the
    push.

    ![The agent asking to push and re-review](images/feature-builder-push-rereview.png)

To do: the pull request.

## Merge the pull request

To do: merge with **Squash and merge**, then delete the branch.

## Repeat for ticket 2

```bash
claude --agent feature-builder "#2"
```

## Done

To do: what you should see when both tickets are merged into `dev`.
