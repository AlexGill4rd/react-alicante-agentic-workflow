# Release-manager walkthrough

Draft. The steps are written after the rehearsal.

Goal: release tickets 1 and 2 to Production with the `release-manager` agent.
Both tickets must be merged into `dev` first.

## Start

Open a terminal in VS Code, not the Claude chat. Run it from the repo root:

```bash
claude --agent release-manager "next minor"
```

The agent first shows the current version and the next one. Type **confirm**.

![The agent asking to confirm the next version](images/release-manager-start-version.png)

## Steps

The agent stops after each phase. Read the report, then answer.

1. **Phase 1, Code freeze.** The agent checks the version bump, CI status and
   that all tickets are merged into `dev`. It may ask about these one by one
   or grouped together — the wording changes each run, but it is the same
   three checks. Answer each. Then it asks once more to confirm they are all
   settled before it creates the release branch. Type **confirm**.

   ![The agent asking to confirm the version, CI status and merged tickets](images/release-manager-version.png)

   Zero CI runs on a fork means Actions is not enabled yet. The agent stops
   until CI is green on `dev`.

   1. On github.com, open your fork's **Actions** tab and enable Actions.
   2. Tell the agent to push an empty commit to `dev`. Approve the push.
   3. Wait for the run to turn green. Then tell the agent CI is green.

2. The agent creates the release branch and bumps the version in
   `package.json`. It may stop after each one to ask **yes**, or report both
   done at once — read the report either way. The branch and the commit are
   not pushed yet.

   ![The release branch created](images/release-manager-branch.png)

   ![The agent asking to confirm the version write](images/release-manager-bump-confirm.png)

   ![The version bump committed](images/release-manager-bump-done.png)

3. **Phase 2, changelog.** The agent shows a draft of the changelog. Type
   **yes** to write it. It shows the diff written to `CHANGELOG.md`. Then it
   reports two commits, not pushed yet. Type **yes** for Phase 3.

   ![The diff written to CHANGELOG.md](images/release-manager-changelog-diff.png)

   The agent did ask to confirm the version bump — this screenshot is a status
   catch-up after that, showing the branch, the version bump and the
   changelog draft together.

   ![The agent's status catch-up showing the branch, version bump and changelog draft](images/release-manager-changelog-combined.png)

   ![The changelog draft](images/release-manager-changelog.png)

   ![Phase 2 done](images/release-manager-phase2-done.png)

4. **Phase 3, release PR.** The agent lists what it will push and asks for your
   approval. "yes" does not count. Type **push**. Then it asks to push the
   branch and create a label and the QA milestone. Choose **Yes**.

   ![The push approval](images/release-manager-push-approval.png)

   It opens the release PR to `main`. Vercel is still building the preview, so
   do not test yet. Type **next**.

   ![The release PR is open](images/release-manager-pr-open.png)

5. **Environment variables.** The agent compares `.env.example` with the code.
   Here there are no new variables, so there is nothing to add to Vercel.

   ![No new environment variables](images/release-manager-env-none.png)

   If there were new ones, the agent lists them. You add them in Vercel, under
   **Project → Settings → Environment Variables**, and then type **done**.

   ![New environment variables listed](images/release-manager-env-changes.png)

6. **Database health check.** The agent does not run database commands. Open a
   second terminal next to the Claude one, and run them yourself, from the repo
   root.

   ![The agent asking for your help](images/release-manager-db-help.png)

   ![A second terminal next to the Claude terminal](images/release-manager-db-terminal.png)

   1. `pnpm db:link:status`. The dot must be on `ra-qa`.

      ![The linked project is ra-qa](images/release-manager-link-status.png)

   2. `pnpm db:migrations:list`. The **Local** and **Remote** columns must be
      the same. If it fails or hangs, log in first with `pnpm supabase login`,
      then run it again.

      Still fails? In the terminal, set your database password, then run it with
      the Session pooler connection string from the setup guide:

      ```bash
      export SUPABASE_DB_PASSWORD='your password'
      pnpm supabase migration list --db-url '<connection-string>'
      ```

      ![The migrations list](images/release-manager-migrations-list.png)

   3. In the Supabase dashboard, open the **SQL Editor** and run the two queries
      from the agent. Both must return no rows.

      ![The first SQL query, no rows](images/release-manager-sql-1.png)

      ![The second SQL query, no rows](images/release-manager-sql-2.png)

   Then tell the agent what you saw.

To do: the next phases, from the QA test to the tag.

## Merge the release pull request

To do: merge with **Create a merge commit**, not squash.

## Production database

To do: link to Production, run the dry run and the push, link back to QA.

## Done

To do: what you should see in Production and on GitHub.
