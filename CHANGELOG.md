# Changelog

All notable changes to this project are documented here.

## 0.1.0 - 2026-08-19

### Added

- npm workspaces and Turborepo orchestration.
- Automated versioning, release checks, secret scanning, and repository-root guards.
- GitHub CI and Cloudflare deployment workflows.
- A Cloudflare-compatible Resend email provider for EmDash magic links.

### Changed

- Moved the EmDash site into the `apps/site` workspace.
- Standardized local and CI runtime on Node.js 22.22.2.
