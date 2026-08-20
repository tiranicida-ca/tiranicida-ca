import { execFileSync } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const run = (args) => execFileSync(npm, args, { stdio: "inherit" });

run(["run", "guard:release"]);
run(["exec", "--", "versioning", "patch", "--branch-aware", "--target-branch", "main", "--no-commit", "--no-tag"]);
run(["exec", "--", "versioning", "update-readme"]);
run(["run", "release:check"]);
