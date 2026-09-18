import { execFileSync } from "node:child_process";

const BASELINE = "workshop-baseline";

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

function run(command, args) {
  return execFileSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function git(args) {
  try {
    return run("git", args);
  } catch (error) {
    fail(error.stderr?.trim() || error.message);
  }
}

function gh(args) {
  try {
    return run("gh", args);
  } catch (error) {
    fail(error.stderr?.trim() || error.message);
  }
}

const repo = (() => {
  const url = git(["remote", "get-url", "origin"]);
  const match = url.match(/github\.com[:/]([^/]+\/[^/]+?)(?:\.git)?$/);
  if (!match) fail(`origin is not a GitHub repo: ${url}`);
  return match[1];
})();

// Only ever reset a throwaway fork, never the starter repo itself.
const { isFork } = JSON.parse(gh(["repo", "view", repo, "--json", "isFork"]));
if (!isFork) {
  fail(`${repo} is not a fork. Only run this in your practice fork.`);
}

// The tag comes with the fork and marks the clean starting point. Creating it
// here would tag whatever the run left behind, so refuse instead.
if (!git(["tag", "--list", BASELINE])) {
  git(["fetch", "--tags", "--quiet", "origin"]);
}
if (!git(["tag", "--list", BASELINE])) {
  fail(
    `No ${BASELINE} tag. It should come from the repo you forked.\n` +
      `  Fetch it with: git fetch --tags upstream`,
  );
}

console.log(`\nRepo: ${repo}   Baseline: ${BASELINE}\n`);

// 1. Migrations applied during the run — the database can't be reset from here.
const migrations = git([
  "diff", "--name-only", "--diff-filter=A", `${BASELINE}..HEAD`, "--", "supabase/migrations",
])
  .split("\n")
  .filter(Boolean);

// 2. Git: back to the baseline, and drop what the run created.
const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]);
if (branch !== "dev") {
  git(["checkout", "dev"]);
}
git(["reset", "--hard", BASELINE]);

const branches = git(["branch", "--format=%(refname:short)"])
  .split("\n")
  .filter((name) => name && name !== "dev" && name !== "main");
for (const name of branches) {
  git(["branch", "-D", name]);
}

const staleTags = git(["tag", "--list"])
  .split("\n")
  .filter((tag) => tag && tag !== BASELINE);
for (const tag of staleTags) {
  git(["tag", "-d", tag]);
}

// 3. Issues: clear them so the tickets can be created fresh.
const issues = JSON.parse(
  gh(["issue", "list", "--repo", repo, "--state", "all", "--limit", "200", "--json", "number"]),
);
for (const { number } of issues) {
  gh(["issue", "delete", String(number), "--repo", repo, "--yes"]);
}
console.log(`Deleted ${issues.length} issue(s), reset dev to ${BASELINE}.`);
console.log(`Deleted local branches: ${branches.join(", ") || "none"}`);
console.log(`Deleted local tags: ${staleTags.join(", ") || "none"}\n`);

console.log("Now finish by hand:\n");
console.log("  1. Recreate the tickets:  pnpm workshop:tickets");
console.log(`  2. Overwrite the remote:  git push --force origin dev`);
console.log(`     Delete remote branches/tags left from the run in GitHub, or with`);
console.log(`     git push origin --delete <name>`);

if (migrations.length > 0) {
  console.log("\n  3. Undo these migrations in the Supabase SQL editor:");
  for (const file of migrations) {
    console.log(`       ${file}`);
  }
  console.log("     e.g. drop the columns, types and tables they created.");
}

console.log("");
