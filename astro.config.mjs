import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { formsPlugin } from "@emdash-cms/plugin-forms";
// import { webhookNotifierPlugin } from "@emdash-cms/plugin-webhook-notifier";
import { defineConfig, fontProviders } from "astro/config";
import emdash from "emdash/astro";

export default defineConfig({
	output: "server",
	adapter: cloudflare(),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: d1({ binding: "DB", session: "auto" }),
			storage: r2({ binding: "MEDIA" }),
			email: {
				type: "smtp",
				host: import.meta.env.SMTP_HOST || "mail.xn--tlo-fla.com",
				port: parseInt(import.meta.env.SMTP_PORT || "587"),
				user: import.meta.env.SMTP_USER || "noreply@tiranicida.ca",
				pass: import.meta.env.SMTP_PASS || "",
				from: import.meta.env.SMTP_FROM || "noreply@tiranicida.ca",
				fromName: import.meta.env.SMTP_FROM_NAME || "TLAO",
			},
			plugins: [formsPlugin()],
			// Sandboxed plugins + marketplace require paid Workers plan (Dynamic Workers)
			// sandboxed: [webhookNotifierPlugin()],
			// sandboxRunner: sandbox(),
			// marketplace: "https://marketplace.emdashcms.com",
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Inter",
			cssVariable: "--font-sans",
			weights: [400, 500, 600, 700],
			fallbacks: ["sans-serif"],
		},
		{
			provider: fontProviders.google(),
			name: "JetBrains Mono",
			cssVariable: "--font-mono",
			weights: [400, 500],
			fallbacks: ["monospace"],
		},
	],
	devToolbar: { enabled: false },
});
