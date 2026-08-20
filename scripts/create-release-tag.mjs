import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const version = JSON.parse(readFileSync("package.json", "utf8")).version;
const output = (command, args) => execFileSync(command, args, { encoding: "utf8" }).trim();

execFileSync(pnpm, ["run", "guard:tag"], { stdio: "inherit" });

if (output("git", ["status", "--porcelain"]) !== "") {
	throw new Error("Commit or stash local changes before creating a release tag.");
}

if (output("git", ["rev-parse", "HEAD"]) !== output("git", ["rev-parse", "origin/main"])) {
	throw new Error("Update local main from origin/main before creating a release tag.");
}

execFileSync(pnpm, ["run", "release:check"], { stdio: "inherit" });
execFileSync(pnpm, ["exec", "versioning", "guard-tag", "--tag", `v${version}`], { stdio: "inherit" });
execFileSync("git", ["tag", "-a", `v${version}`, "-m", `Release v${version}`], { stdio: "inherit" });
execFileSync("git", ["push", "origin", `v${version}`], { stdio: "inherit" });
