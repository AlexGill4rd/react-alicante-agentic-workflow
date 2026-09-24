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

      - First: tables with row level security (RLS) off. A row would be a
        security gap.
      - Second: foreign keys with no index. A row would be a slow query.

      ![The first SQL query, no rows](images/release-manager-sql-1.png)

      ![The second SQL query, no rows](images/release-manager-sql-2.png)

   Then tell the agent what you saw, and paste the output of
   `pnpm db:link:status`. The agent checks that the dot is on `ra-qa`, not
   `ra-prod`. Type **next**.

7. **Test coverage.** The agent runs the tests and lists what is new in this
   release without a test. It is information only, nothing blocks. Read it, then
   type **next**.

   ![The test coverage report](images/release-manager-coverage.png)

8. **Security audit.** The agent audits the whole app and changes nothing. Here
   there are no Critical or High findings, so nothing blocks QA. It asks if it
   should file the smaller findings as GitHub tickets. They have no milestone,
   so they stay out of this release. Type **file them** or **skip**.

   ![The security audit report](images/release-manager-security.png)

9. **QA on the preview.** With **file them**, the agent files the tickets, and
   you find them in the **Issues** tab. Then it gives the link to the Vercel
   preview. Open it and check the changed features (here the Speakers page and
   the session level) and the critical paths. Then reply **QA done, all good**,
   or **QA done, bugs found** and describe what you found. The agent checks the
   release process, not the logic of the code. You are the QA.

   ![The follow-up tickets and the preview link](images/release-manager-qa.png)

10. **Before Production.** The next step applies the migration to Production,
    and that is hard to undo. The agent asks: review the changes for bugs first,
    or go straight to the production migration? The release agent does not read
    the code for logic errors, so this is your chance to ask for a review.

    ![The agent asking to review for bugs first or go to the production migration](images/release-manager-review-offer.png)

11. **Production database.** The agent does not run database commands. In your
    second terminal, from the repo root, link to Production with the `prod-ref`
    from your note, then check the link:

    ```bash
    pnpm supabase link --project-ref <prod-ref>
    ```

    ```bash
    pnpm db:link:status
    ```

    Paste the output. Linking prints no proof, so the agent needs to see the
    `●` on the `ra-prod` row. It asks you to confirm before it goes on: the next
    commands touch Production.

    ![The agent asking for the link status](images/release-manager-prod-link-status.png)

12. Reply **apply**. Then run `pnpm db:push` in your terminal, type **y** at its
    prompt, and paste the output.

    ![The agent asking to apply the migration](images/release-manager-prod-apply.png)

13. The agent checks the migrations list: Local and Remote must match on
    `ra-prod`. Then look in the Supabase dashboard, in `ra-prod` → **Table
    Editor** → **sessions**. You should see 8 rows and a `level` column. Reply
    **verified**.

    ![The migrations are applied to ra-prod](images/release-manager-prod-verified.png)

14. Regenerate the types, and commit the file if it changed. Here it does not,
    because QA has the same schema.

    ```bash
    pnpm db:types
    ```

15. Link back to QA, so your next ticket works on QA again:

    ```bash
    pnpm supabase link --project-ref <qa-ref>
    ```

    ```bash
    pnpm db:link:status
    ```

    Paste the output. The `●` must be on `ra-qa`. The agent then shows a
    pre-merge summary: the QA milestone has no open issues, no merge conflicts,
    CI and Vercel pass, and the migrations are applied to Production.

    ![The pre-merge summary](images/release-manager-premerge.png)

## Merge the release pull request

Open the release PR on GitHub and merge it with **Create a merge commit**. Do
not squash or rebase: they break the tag history, and the next changelog
repeats old commits. The agent does not merge it for you.

Merging to `main` deploys Production. In Vercel, under **Deployments**, wait
for the new **Production** deployment to be **Ready**.

![The Production deployment is Ready in Vercel](images/release-manager-deploy.png)

Reply **merged**. The agent runs the post-merge steps: the tag, the GitHub release, and `main` back into
`dev`.

## Post-merge

1. **Tag.** The agent switches to `main` and checks that it is the merge commit
   of the release PR. Then it says it will create the tag `v0.4.0` on that
   commit and push only the tag to `origin`. It may mention that `git checkout
main` failed at first because of two remotes (`origin` and `upstream`), and
   how it fixed that. Nothing for you to do. Type **tag**.

   ![The agent asking to create and push the tag](images/release-manager-tag.png)

2. **GitHub release, and back into `dev`.** The agent pushes the tag and
   publishes the GitHub release, and gives you the link. The test table in
   `CHANGELOG.md` still says "pending", because CI had not run on the release
   branch when the changelog was written. The release notes have the real
   results. You can fix the file later on `dev`.

   Then it asks to merge `main` back into `dev` and push `dev` to `origin`, so
   `dev` has the release commit. Type **merge back**.

   ![The release is published and the agent asks to merge main back into dev](images/release-manager-merge-back.png)

3. **Check Production.** The agent merges `main` into `dev` and pushes `dev` to
   `origin`. Now `dev`, `origin/dev` and `origin/main` are all on the same
   commit. Check the Vercel dashboard, then open the live site: the Speakers
   page and the session levels now come from your `ra-prod` database. Reply
   **production ok**. The agent closes the QA milestone and finishes the
   release.

   ![The agent asking to check the live site](images/release-manager-production-check.png)

## Done

The agent lists what it did. The release is complete.

![The agent's final report](images/release-manager-complete.png)

You should see:

- The tag `v0.4.0` on `main`, and a GitHub release marked **Latest**.
- `dev` and `main` on the same commit.
- The QA milestone closed, with no open issues.
- The follow-up tickets from the security audit still **open** in the
  **Issues** tab.
- The Speakers page and the session levels on your live site.
