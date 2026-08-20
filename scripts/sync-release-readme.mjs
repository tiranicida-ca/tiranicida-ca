import { readFileSync, writeFileSync } from "node:fs";

const packageVersion = JSON.parse(readFileSync("package.json", "utf8")).version;
const readmePath = "README.md";
const readme = readFileSync(readmePath, "utf8");
const releaseLine = /\*\*Current release: `[^`]+`\*\*/;

if (!releaseLine.test(readme)) {
	throw new Error("README.md must contain a '**Current release: `x.y.z`**' line.");
}

writeFileSync(readmePath, readme.replace(releaseLine, `**Current release: \`${packageVersion}\`**`));
