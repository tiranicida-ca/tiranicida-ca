import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const output = (command, args) => execFileSync(command, args, { encoding: "utf8" }).trim();
const run = (command, args) => execFileSync(command, args, { stdio: "inherit" });
const branch = output("git", ["branch", "--show-current"]);
const synchronizeOnly = process.argv.includes("--sync");

const getPackageVersion = (ref) => JSON.parse(output("git", ["show", `${ref}:package.json`])).version;
const summarizePaths = (paths) => {
	const categories = [
		["Application", (path) => path.startsWith("apps/site/")],
		["CI and deployment", (path) => path.startsWith(".github/workflows/")],
		["Quality automation", (path) => path.startsWith(".github/") || path.startsWith(".husky/")],
		["Release automation", (path) => path.startsWith("scripts/") || path === "versioning.config.json"],
		["Workspace tooling", (path) => ["package.json", "pnpm-lock.yaml", "pnpm-workspace.yaml", "turbo.json", ".npmrc", ".nvmrc"].includes(path)],
		["Documentation", (path) => ["README.md", "CHANGELOG.md", "CONTRIBUTING.md", "SECURITY.md"].includes(path) || path.startsWith("docs/")],
	];
	const grouped = new Map();

	for (const path of paths) {
		const category = categories.find(([, matches]) => matches(path))?.[0] ?? "Repository configuration";
		grouped.set(category, [...(grouped.get(category) ?? []), path]);
	}

	return [...grouped].map(([category, categoryPaths]) => {
		const displayed = categoryPaths.slice(0, 6).map((path) => `\`${path}\``).join(", ");
		const remaining = categoryPaths.length - 6;
		return `- **${category}** — ${displayed}${remaining > 0 ? `, and ${remaining} more` : ""}`;
	});
};

const getReleaseDetails = () => {
	const base = "origin/main";
	const version = JSON.parse(readFileSync("package.json", "utf8")).version;
	const previousVersion = getPackageVersion(base);
	const repository = output("gh", ["repo", "view", "--json", "nameWithOwner", "--jq", ".nameWithOwner"]);
	const changedPaths = output("git", ["diff", "--name-only", `${base}...HEAD`]).split("\n").filter(Boolean);
	const commits = output("git", ["log", "--format=%s", `${base}..HEAD`])
		.split("\n")
		.filter((subject) => subject && !subject.includes("chore(release):"));
	const comparisonUrl = `https://github.com/${repository}/compare/main...develop`;

	return {
		body: [
			"## Release",
			"",
			`- **Version:** \`${previousVersion}\` → \`${version}\``,
			`- **Comparison:** [\`main...develop\`](${comparisonUrl})`,
			"- **Promotion:** `develop` → `main`",
			"",
			"## Objective",
			"",
			`Promote release \`${version}\` to production with the changes currently in \`develop\`.`,
			"",
			"## Change surface",
			"",
			...(summarizePaths(changedPaths).length > 0 ? summarizePaths(changedPaths) : ["- No file changes detected."]),
			"",
			"## Included changes",
			"",
			...(commits.length > 0 ? commits.map((subject) => `- ${subject}`) : ["- No commits detected."]),
			"",
			"## Validation",
			"",
			"- [x] `pnpm run release:check`",
			"- [x] `pnpm run secrets:check`",
			"",
			"## Deployment",
			"",
			"- [x] Deploys automatically after this PR merges to `main`.",
		].join("\n"),
		repository,
		title: `🔖 chore(release): v${version}`,
	};
};

if (branch !== "develop") {
	throw new Error("Release pull requests must be created from develop to main.");
}

if (!synchronizeOnly) {
	run(pnpm, ["run", "release:patch"]);
	run("git", ["add", "package.json", "apps/site/package.json", "CHANGELOG.md", "README.md", "pnpm-lock.yaml", "scripts/sync-release-readme.mjs", "scripts/sync-workspace-versions.mjs", "scripts/verify-workspace-versions.mjs"]);
	run(pnpm, ["run", "secrets:check"]);

	try {
		output("git", ["diff", "--cached", "--quiet"]);
		throw new Error("Release preparation produced no changes.");
	} catch (error) {
		if (error.message.includes("Release preparation")) throw error;
	}

	const version = JSON.parse(readFileSync("package.json", "utf8")).version;
	run("git", ["commit", "-m", `🔖 chore(release): v${version}`]);
	run("git", ["push", "--set-upstream", "origin", "develop"]);
}

const { body, repository, title } = getReleaseDetails();

const existingPrs = JSON.parse(output("gh", [
	"pr", "list", "--state", "open", "--base", "main", "--head", "develop", "--json", "number,url",
]));

if (existingPrs.length > 0) {
	run("gh", ["api", "--silent", "--method", "PATCH", `repos/${repository}/pulls/${existingPrs[0].number}`, "-f", `title=${title}`, "-f", `body=${body}`]);
	console.log(`Updated release pull request: ${existingPrs[0].url}`);
	process.exit(0);
}

if (synchronizeOnly) {
	throw new Error("No open develop-to-main release pull request exists to synchronize.");
}

run("gh", [
	"pr", "create", "--base", "main", "--head", "develop", "--title", title, "--body", body,
]);
