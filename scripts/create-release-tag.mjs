import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const version = JSON.parse(readFileSync("package.json", "utf8")).version;
const output = (command, args) => execFileSync(command, args, { encoding: "utf8" }).trim();

if (output("git", ["branch", "--show-current"]) !== "main") {
	throw new Error("Release tags can only be created from the local main branch.");
}

if (output("git", ["status", "--porcelain"]) !== "") {
	throw new Error("Commit or stash local changes before creating a release tag.");
}

if (output("git", ["rev-parse", "HEAD"]) !== output("git", ["rev-parse", "origin/main"])) {
	throw new Error("Update local main from origin/main before creating a release tag.");
}

execFileSync(npm, ["run", "release:check"], { stdio: "inherit" });
execFileSync(npm, ["exec", "--", "versioning", "guard-tag", "--tag", `v${version}`], { stdio: "inherit" });
execFileSync("git", ["tag", "-a", `v${version}`, "-m", `Release v${version}`], { stdio: "inherit" });
execFileSync("git", ["push", "origin", `v${version}`], { stdio: "inherit" });
