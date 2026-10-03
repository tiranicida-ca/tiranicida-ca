import { definePlugin } from "emdash";
import type { PluginDescriptor, ResolvedPlugin } from "emdash";

const RELAY_ORIGIN = "https://relay.tiranicida.ca";

/**
 * Sends EmDash system email (including admin magic links) through the
 * Tiranicida HTTPS mail relay. Cloudflare Workers cannot make SMTP
 * connections, so the relay owns the SMTP + STARTTLS delivery step.
 *
 * The authorization token is a Worker secret and must never be persisted in
 * EmDash settings, source, or the client bundle.
 */
export function createPlugin(): ResolvedPlugin {
	return definePlugin({
		id: "tiranicida-email-relay",
		version: "1.0.0",
		capabilities: ["email:provide", "network:fetch"],
		allowedHosts: ["relay.tiranicida.ca"],
		hooks: {
			"email:deliver": {
				exclusive: true,
				handler: async ({ message }, ctx) => {
					const relayUrl = getRelayUrl();
					const relayToken = process.env.EMAIL_RELAY_TOKEN;
					if (!relayToken) {
						throw new Error("Tiranicida email relay is not configured: EMAIL_RELAY_TOKEN is missing.");
					}

					const response = await ctx.http!.fetch(relayUrl, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${relayToken}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							to: message.to,
							subject: message.subject,
							text: message.text,
						}),
					});

					if (!response.ok) {
						throw new Error(`Tiranicida mail relay rejected the email (HTTP ${response.status}).`);
					}
				},
			},
		},
	});
}

function getRelayUrl(): string {
	const configuredUrl = process.env.EMAIL_RELAY_URL;
	if (!configuredUrl) {
		throw new Error("Tiranicida email relay is not configured: EMAIL_RELAY_URL is missing.");
	}

	let parsedUrl: URL;
	try {
		parsedUrl = new URL(configuredUrl);
	} catch {
		throw new Error("Tiranicida email relay URL is invalid.");
	}

	if (parsedUrl.origin !== RELAY_ORIGIN || !["", "/"].includes(parsedUrl.pathname)) {
		throw new Error("Tiranicida email relay URL must be https://relay.tiranicida.ca.");
	}

	return `${RELAY_ORIGIN}/send`;
}

export function emailRelayPlugin(): PluginDescriptor {
	return {
		id: "tiranicida-email-relay",
		version: "1.0.0",
		entrypoint: new URL("./email-relay.ts", import.meta.url).pathname,
		capabilities: ["email:provide", "network:fetch"],
		allowedHosts: ["relay.tiranicida.ca"],
	};
}
