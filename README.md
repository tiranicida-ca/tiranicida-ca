# Tiranicida.ca

Tiranicida.ca is an EmDash CMS site deployed as a Cloudflare Worker. This repository is an npm workspace monorepo managed with Turborepo.

**Current release: `0.1.0`**

## Workspace layout

```text
apps/site     EmDash + Astro + Cloudflare Worker
scripts/      Release and repository guard automation
.github/      CI, secret scanning, and deployment workflows
```

## Requirements

- Node.js `22.22.2` (see `.nvmrc`)
- npm `>=10.9.0 <11`

## Development

```bash
npm ci
npm run dev
npm run typecheck
npm run build
```

The EmDash admin is available at `http://localhost:4321/_emdash/admin` while the site is running.

## Quality and security guards

```bash
npm run ci             # version sync, root hygiene, README, typecheck, build
npm run secrets:check  # staged-file secret scan
```

Husky runs the secret and root-hygiene guards before each commit. CI also runs Gitleaks. Keep credentials in Cloudflare or GitHub secrets; `.env` files are ignored.

## Releases and deployment

`@edcalderon/versioning` keeps the root and workspace versions synchronized. Use `npm run release:pr` to prepare the next patch version, validate it, commit it, push it, and open its pull request. `npm run release:patch` is available when you want to review the generated release changes before creating the PR. After merge, update your local `main` branch and run `npm run release:tag` to create a validated tag.

The Cloudflare workflow deploys automatically on pushes to `main` (normally through merged pull requests) and can be dispatched manually. Add `CLOUDFLARE_API_TOKEN` as a GitHub Actions secret with permission to deploy this Worker.

## Admin email

The included Resend provider delivers EmDash magic links. From an authenticated admin session, add the Resend API key in the provider settings and ensure the configured sender belongs to a verified Resend domain. If magic links are the only enabled login method, bootstrap a passkey or another administrator session before relying on the provider. The key is stored as an EmDash secret setting, not in this repository or Worker configuration.
