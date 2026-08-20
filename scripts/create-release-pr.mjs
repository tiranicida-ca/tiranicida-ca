import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const output = (command, args) => execFileSync(command, args, { encoding: "utf8" }).trim();
const run = (command, args) => execFileSync(command, args, { stdio: "inherit" });
const branch = output("git", ["branch", "--show-current"]);

if (branch !== "develop") {
	throw new Error("Release pull requests must be created from develop to main.");
}

run(pnpm, ["run", "release:patch"]);
run("git", ["add", "package.json", "apps/site/package.json", "CHANGELOG.md", "README.md", "pnpm-lock.yaml", "scripts/sync-release-readme.mjs", "scripts/sync-workspace-versions.mjs", "scripts/verify-workspace-versions.mjs"]);

try {
	output("git", ["diff", "--cached", "--quiet"]);
	throw new Error("Release preparation produced no changes.");
} catch (error) {
	if (error.message.includes("Release preparation")) throw error;
}

const version = JSON.parse(readFileSync("package.json", "utf8")).version;
run("git", ["commit", "-m", `🔖 chore(release): v${version}`]);
run("git", ["push", "--set-upstream", "origin", "develop"]);

const existingPrs = JSON.parse(output("gh", [
	"pr", "list", "--state", "open", "--base", "main", "--head", "develop", "--json", "url",
]));

if (existingPrs.length > 0) {
	console.log(`Updated release pull request: ${existingPrs[0].url}`);
	process.exit(0);
}

run("gh", [
	"pr", "create", "--base", "main", "--head", "develop", "--title", `🔖 chore(release): v${version}`,
	"--body", `## Summary\n\n- Prepare release v${version}.\n- Synchronize workspace versions, changelog, and README.\n\n## Validation\n\n- pnpm run release:check`,
]);
