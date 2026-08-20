import { definePlugin } from "emdash";
import type { PluginDescriptor, ResolvedPlugin } from "emdash";

const RESEND_API_URL = "https://api.resend.com/emails";

/**
 * Sends EmDash system email (including admin magic links) through Resend.
 *
 * The API key is deliberately an EmDash secret setting, rather than an Astro
 * or Worker environment variable: it is then available to the plugin at
 * request time on Cloudflare without being embedded in the Worker bundle.
 */
export function createPlugin(): ResolvedPlugin {
	return definePlugin({
		id: "tiranicida-resend-email",
		version: "1.0.0",
		capabilities: ["email:provide", "network:fetch"],
		allowedHosts: ["api.resend.com"],
		admin: {
			settingsSchema: {
				apiKey: {
					type: "secret",
					label: "Resend API key",
					description: "Create a sending key in Resend with access to the verified domain.",
				},
				fromEmail: {
					type: "email",
					label: "From email address",
					default: "noreply@tiranicida.ca",
				},
				fromName: {
					type: "string",
					label: "From name",
					default: "TLAO",
				},
			},
		},
		hooks: {
			"email:deliver": {
				exclusive: true,
				handler: async ({ message }, ctx) => {
					const apiKey = await ctx.kv.get<string>("settings:apiKey");
					if (!apiKey) {
						throw new Error(
							"Resend email provider is not configured. Add its API key in the EmDash plugin settings.",
						);
					}

					const fromEmail =
						(await ctx.kv.get<string>("settings:fromEmail")) ?? "noreply@tiranicida.ca";
					const fromName = (await ctx.kv.get<string>("settings:fromName")) ?? "TLAO";
					const response = await ctx.http!.fetch(RESEND_API_URL, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${apiKey}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							from: `${fromName} <${fromEmail}>`,
							to: [message.to],
							subject: message.subject,
							text: message.text,
							html: message.html,
						}),
					});

					if (!response.ok) {
						throw new Error(`Resend rejected the email (HTTP ${response.status}).`);
					}
				},
			},
		},
	});
}

export function resendEmailPlugin(): PluginDescriptor {
	return {
		id: "tiranicida-resend-email",
		version: "1.0.0",
		entrypoint: new URL("./resend-email.ts", import.meta.url).pathname,
		capabilities: ["email:provide", "network:fetch"],
		allowedHosts: ["api.resend.com"],
	};
}
