import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const TICKETS_DIR = "docs/workshop/tickets";
const LABEL = "feature";
const dryRun = process.argv.includes("--dry-run");

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

function gh(args) {
  try {
    return run("gh", args);
  } catch (error) {
    fail(error.stderr?.trim() || error.message);
  }
}

function checkGhReady() {
  try {
    run("gh", ["auth", "status"]);
  } catch (error) {
    if (error.code === "ENOENT") {
      fail("GitHub CLI isn't installed. See https://cli.github.com");
    }
    fail("GitHub CLI isn't logged in. Run: gh auth login");
  }
}

function originRepo() {
  let url;
  try {
    url = run("git", ["remote", "get-url", "origin"]);
  } catch {
    fail("No git remote named origin. Run this inside your cloned fork.");
  }
  const match = url.match(/github\.com[:/]([^/]+\/[^/]+?)(?:\.git)?$/);
  if (!match) {
    fail(`origin is not a GitHub repo: ${url}`);
  }
  return match[1];
}

function readTickets() {
  return readdirSync(TICKETS_DIR)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => {
      const [firstLine, ...rest] = readFileSync(
        path.join(TICKETS_DIR, file),
        "utf8",
      ).split("\n");
      if (!firstLine.startsWith("# ")) {
        fail(`${file} must start with a "# Title" line`);
      }
      return {
        title: firstLine.slice(2).trim(),
        body: rest.join("\n").trim(),
      };
    });
}

checkGhReady();

const repo = originRepo();
const { isFork, hasIssuesEnabled } = JSON.parse(
  gh(["repo", "view", repo, "--json", "isFork,hasIssuesEnabled"]),
);

// Guards the shared starter repo: tickets belong in each attendee's own fork.
if (!isFork) {
  fail(`${repo} is not a fork. Fork the starter repo, clone your fork, and run this there.`);
}

const tickets = readTickets();
console.log(`\nRepo: ${repo}${dryRun ? "  (dry run: nothing will change)" : ""}\n`);

if (!dryRun) {
  // Without this, gh in a fork can resolve issue numbers against the upstream repo.
  gh(["repo", "set-default", repo]);
  gh(["repo", "edit", repo, "--enable-issues"]);
  gh([
    "label", "create", LABEL,
    "--repo", repo,
    "--color", "0E8A16",
    "--description", "New feature",
    "--force",
  ]);
}

const existingTitles = new Set(
  dryRun && !hasIssuesEnabled
    ? []
    : JSON.parse(
        gh(["issue", "list", "--repo", repo, "--state", "all", "--limit", "500", "--json", "title"]),
      ).map((issue) => issue.title),
);

for (const ticket of tickets) {
  if (existingTitles.has(ticket.title)) {
    console.log(`• Already exists, skipped: ${ticket.title}`);
    continue;
  }
  if (dryRun) {
    console.log(`• Would create: ${ticket.title}`);
    continue;
  }
  const url = gh([
    "issue", "create",
    "--repo", repo,
    "--title", ticket.title,
    "--body", ticket.body,
    "--label", LABEL,
    "--assignee", "@me",
  ]);
  console.log(`• Created: ${ticket.title}\n  ${url}`);
}

console.log("");
