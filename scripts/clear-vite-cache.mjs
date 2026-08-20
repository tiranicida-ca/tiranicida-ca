import { existsSync, rmSync } from "node:fs";
import { resolve, sep } from "node:path";

const siteDirectory = resolve(import.meta.dirname, "..", "apps", "site");
const cacheDirectory = resolve(siteDirectory, process.env.ASTRO_VITE_CACHE_DIR ?? "./node_modules/.vite");

if (!cacheDirectory.startsWith(`${siteDirectory}${sep}`)) {
	throw new Error("Vite cache directory must remain inside apps/site.");
}

if (existsSync(cacheDirectory)) {
	rmSync(cacheDirectory, { force: true, recursive: true });
	console.log("Cleared the Vite dependency optimizer cache.");
}
