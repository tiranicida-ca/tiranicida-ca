import { existsSync, rmSync } from "node:fs";

const cacheDirectory = new URL("../apps/site/node_modules/.vite", import.meta.url);

if (existsSync(cacheDirectory)) {
	rmSync(cacheDirectory, { force: true, recursive: true });
	console.log("Cleared the Vite dependency optimizer cache.");
}
