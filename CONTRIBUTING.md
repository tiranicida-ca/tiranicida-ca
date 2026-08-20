# Contributing

Use Node.js 22.22.2 and npm `>=10.9.0 <11`.

```bash
npm ci
npm run dev
npm run ci
```

The EmDash application lives in `apps/site`. Do not add application files to the repository root.

Before opening a pull request, run `npm run ci`. The Husky pre-commit hook blocks staged secrets and root-directory drift. Use conventional commit messages because releases and the changelog are generated from them.

For a patch release, run `npm run release:pr` on a release branch. It prepares the version and changelog changes, validates them, commits them, pushes the branch, and opens a PR. Run `npm run release:patch` only when you want to review the generated changes before creating the PR. Deployment runs on pushes to `main` (normally through a merged PR).
