## 0.1.2 (2026-08-20)


### Bug Fixes

* add existing SESSION KV namespace ID to prevent duplicate creation ([7df5d94](https://github.com/tiranicida-ca/tiranicida-ca/commit/7df5d9407761a835138bee963a023494a9a8e8f7))
* configure SMTP email in emdash integration ([ad1ed42](https://github.com/tiranicida-ca/tiranicida-ca/commit/ad1ed429d7341c5c1cab3a2b965aaed979cb2b80))
* hardcode SMTP config for email auth (temporary test) ([1e2a2d4](https://github.com/tiranicida-ca/tiranicida-ca/commit/1e2a2d49f571e63efcc3b14d66808593761b7d5a))
* remove hardcoded credentials from config ([fb122b8](https://github.com/tiranicida-ca/tiranicida-ca/commit/fb122b8abd9179ff95c89f1a35744ebf9ba0ea6f))


### Features

* configure SMTP email using import.meta.env for build-time access ([63a4a90](https://github.com/tiranicida-ca/tiranicida-ca/commit/63a4a9078b6206d84bfb4530627746cf75fa5fd7))
* display site version in footer ([f195775](https://github.com/tiranicida-ca/tiranicida-ca/commit/f1957758e4efa703dcf4d1d183c411cf7b3c66aa))
* enable SMTP email provider for admin magic-link auth ([b7b4c78](https://github.com/tiranicida-ca/tiranicida-ca/commit/b7b4c783a8d0ae11a805a753c120ebf59eb15ed9))





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
