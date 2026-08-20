import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const allowedBranches = new Set(["main", "develop"]);
const action = process.argv[2] ?? "work";
const branch = execFileSync("git", ["branch", "--show-current"], { encoding: "utf8" }).trim();

if (!allowedBranches.has(branch)) {
	throw new Error(`Only main and develop are allowed. Switch to develop before working (current: ${branch || "detached HEAD"}).`);
}

if ((action === "work" || action === "release") && branch !== "develop") {
	throw new Error(`${action === "release" ? "Release preparation" : "Development commits"} must run on develop. main only receives merged pull requests.`);
}

if (action === "tag" && branch !== "main") {
	throw new Error("Release tags must be created from main after the develop-to-main pull request is merged.");
}

if (action === "push") {
	const updates = readFileSync(0, "utf8").trim().split("\n").filter(Boolean);
	for (const update of updates) {
		const [localRef, , remoteRef] = update.split(/\s+/);
		const isBranch = remoteRef?.startsWith("refs/heads/");
		const isDeletion = localRef === "(delete)";

		if (isBranch && remoteRef === "refs/heads/main") {
			throw new Error("Direct pushes to main are blocked. Merge the develop-to-main pull request instead.");
		}
		if (isBranch && remoteRef === "refs/heads/develop" && isDeletion) {
			throw new Error("The develop branch is required and cannot be deleted.");
		}
		if (isBranch && remoteRef !== "refs/heads/develop" && !isDeletion) {
			throw new Error(`Only develop may be pushed. Refusing to create or update ${remoteRef}.`);
		}
		if (!isBranch && !remoteRef?.startsWith("refs/tags/")) {
			throw new Error(`Unsupported remote ref: ${remoteRef ?? "unknown"}.`);
		}
	}
}
