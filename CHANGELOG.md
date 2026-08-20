# Changelog

All notable changes to this project are documented here.

## 0.1.1 - 2026-08-20

### Added

- Displayed the deployed application version in the site footer.
- Enforced the `develop` → `main` release flow with GitHub branch protection and CI checks.

### Changed

- Migrated workspace tooling, release automation, hooks, and GitHub Actions to pnpm.
- Added explicit workspace-version synchronization to patch-release automation.

## 0.1.0 - 2026-08-19

### Added

- npm workspaces and Turborepo orchestration.
- Automated versioning, release checks, secret scanning, and repository-root guards.
- GitHub CI and Cloudflare deployment workflows.
- A Cloudflare-compatible Resend email provider for EmDash magic links.

### Changed

- Moved the EmDash site into the `apps/site` workspace.
- Standardized local and CI runtime on Node.js 22.22.2.
