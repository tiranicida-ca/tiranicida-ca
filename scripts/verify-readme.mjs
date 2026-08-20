import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const rootPackage = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const readme = readFileSync(resolve(root, "README.md"), "utf8");
const changelog = readFileSync(resolve(root, "CHANGELOG.md"), "utf8");
const version = rootPackage.version;

if (!readme.includes(`**Current release: \`${version}\`**`)) {
	throw new Error(`README.md must declare the current release (${version}).`);
}

if (!new RegExp(`^## ${version.replaceAll(".", "\\.")}\\b`, "m").test(changelog)) {
	throw new Error(`CHANGELOG.md must contain a release entry for ${version}.`);
}

console.log(`README and changelog match release ${version}.`);
