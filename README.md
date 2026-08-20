# Tiranicida.ca

Tiranicida.ca is an EmDash CMS site deployed as a Cloudflare Worker. This repository is a pnpm workspace monorepo managed with Turborepo.

**Current release: `0.1.0`**

## Workspace layout

```text
apps/site     EmDash + Astro + Cloudflare Worker
scripts/      Release and repository guard automation
.github/      CI, secret scanning, and deployment workflows
```

## Requirements

- Node.js `22.22.2` (see `.nvmrc`)
- pnpm `9.15.9` (managed by Corepack)

This repository uses pnpm workspaces. Run `pnpm run dev`; npm is not supported for repository commands.

## Development

```bash
pnpm install --frozen-lockfile
pnpm run dev
pnpm run typecheck
pnpm run build
```

The EmDash admin is available at `http://localhost:4321/_emdash/admin` while the site is running.

## Quality and security guards

```bash
pnpm run ci             # version sync, root hygiene, README, typecheck, build
pnpm run secrets:check  # staged-file secret scan
```

Husky runs the secret and root-hygiene guards before each commit. CI also runs Gitleaks. Keep credentials in Cloudflare or GitHub secrets; `.env` files are ignored.

## Releases and deployment

Only two long-lived branches exist: `develop` and `main`. All development commits go to `develop`; `main` only receives the `develop` → `main` release pull request. Do not create feature, hotfix, or release branches.

`@edcalderon/versioning` keeps the root and workspace versions synchronized. From an up-to-date `develop` branch, use `pnpm run release:pr` to prepare the next patch version, validate it, commit it, push `develop`, and open the required `develop` → `main` pull request. Use `pnpm run release:patch` only when you want to inspect the generated release changes before committing them on `develop`. Merge the release PR with a merge commit. After merge, update local `main` and run `pnpm run release:tag` to create a validated tag.

Local Husky guards reject development work outside `develop` and direct pushes to `main`. GitHub CI also fails every `main` pull request whose source is not `develop`; branch protection requires that check before merge.

The Cloudflare workflow deploys automatically on pushes to `main` (normally through merged pull requests) and can be dispatched manually. Add `CLOUDFLARE_API_TOKEN` as a GitHub Actions secret with permission to deploy this Worker.

## Admin email

The included Resend provider delivers EmDash magic links. From an authenticated admin session, add the Resend API key in the provider settings and ensure the configured sender belongs to a verified Resend domain. If magic links are the only enabled login method, bootstrap a passkey or another administrator session before relying on the provider. The key is stored as an EmDash secret setting, not in this repository or Worker configuration.
