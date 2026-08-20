import { execFileSync } from "node:child_process";

const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const run = (args) => execFileSync(pnpm, args, { stdio: "inherit" });

run(["run", "guard:release"]);
run(["exec", "versioning", "patch", "--branch-aware", "--target-branch", "main", "--no-commit", "--no-tag"]);
run(["run", "sync:versions"]);
run(["run", "sync:release-readme"]);
run(["run", "release:check"]);
