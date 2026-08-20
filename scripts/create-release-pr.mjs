import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const output = (command, args) => execFileSync(command, args, { encoding: "utf8" }).trim();
const run = (command, args) => execFileSync(command, args, { stdio: "inherit" });
const branch = output("git", ["branch", "--show-current"]);

if (branch !== "develop") {
	throw new Error("Release pull requests must be created from develop to main.");
}

run(npm, ["run", "release:patch"]);
run("git", ["add", "package.json", "apps/site/package.json", "CHANGELOG.md", "README.md", "package-lock.json"]);

try {
	output("git", ["diff", "--cached", "--quiet"]);
	throw new Error("Release preparation produced no changes.");
} catch (error) {
	if (error.message.includes("Release preparation")) throw error;
}

const version = JSON.parse(readFileSync("package.json", "utf8")).version;
run("git", ["commit", "-m", `🔖 chore(release): v${version}`]);
run("git", ["push", "--set-upstream", "origin", "develop"]);
run("gh", [
	"pr", "create", "--base", "main", "--head", "develop", "--title", `🔖 chore(release): v${version}`,
	"--body", `## Summary\n\n- Prepare release v${version}.\n- Synchronize workspace versions, changelog, and README.\n\n## Validation\n\n- npm run release:check`,
]);
