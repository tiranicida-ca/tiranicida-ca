import { readFileSync } from "node:fs";

const rootPackage = JSON.parse(readFileSync("package.json", "utf8"));
const workspacePackagePaths = ["apps/site/package.json"];
const mismatches = workspacePackagePaths.flatMap((workspacePackagePath) => {
	const workspacePackage = JSON.parse(readFileSync(workspacePackagePath, "utf8"));
	return workspacePackage.version === rootPackage.version
		? []
		: [`${workspacePackagePath}=${workspacePackage.version}`];
});

if (mismatches.length > 0) {
	throw new Error(`Workspace versions must match ${rootPackage.version}: ${mismatches.join(", ")}`);
}

console.log(`Workspace versions match ${rootPackage.version}.`);
