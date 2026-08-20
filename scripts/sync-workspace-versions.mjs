import { readFileSync, writeFileSync } from "node:fs";

const rootPackagePath = "package.json";
const workspacePackagePaths = ["apps/site/package.json"];
const rootPackage = JSON.parse(readFileSync(rootPackagePath, "utf8"));

for (const workspacePackagePath of workspacePackagePaths) {
	const workspacePackage = JSON.parse(readFileSync(workspacePackagePath, "utf8"));
	if (workspacePackage.version !== rootPackage.version) {
		workspacePackage.version = rootPackage.version;
		writeFileSync(workspacePackagePath, `${JSON.stringify(workspacePackage, null, "\t")}\n`);
	}
}
