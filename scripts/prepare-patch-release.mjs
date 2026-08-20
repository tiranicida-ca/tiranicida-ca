import { execFileSync } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const run = (args) => execFileSync(npm, args, { stdio: "inherit" });

run(["exec", "--", "versioning", "patch", "--no-commit", "--no-tag"]);
run(["exec", "--", "versioning", "update-readme"]);
run(["run", "release:check"]);
