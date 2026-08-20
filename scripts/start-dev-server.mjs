import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

process.env.ASTRO_VITE_CACHE_DIR = "./node_modules/.vite-dev";
await import("./clear-vite-cache.mjs");

const siteDirectory = resolve(import.meta.dirname, "..", "apps", "site");
const astroCli = fileURLToPath(new URL("../apps/site/node_modules/astro/bin/astro.mjs", import.meta.url));
const child = spawn(process.execPath, [astroCli, "dev", ...process.argv.slice(2)], {
	cwd: siteDirectory,
	env: process.env,
	stdio: "inherit",
});

child.on("exit", (code, signal) => {
	if (signal) process.kill(process.pid, signal);
	process.exitCode = code ?? 1;
});
