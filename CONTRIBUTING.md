# Contributing

Use Node.js 22.22.2 and npm `>=10.9.0 <11`.

Use npm workspaces (`npm run dev`), not pnpm.

```bash
npm ci
npm run dev
npm run ci
```

The EmDash application lives in `apps/site`. Do not add application files to the repository root.

Work only on `develop`. Do not create feature, hotfix, or release branches, and never commit or push directly to `main`. Before opening a pull request, run `npm run ci`. The Husky pre-commit hook blocks work outside `develop`, staged secrets, and root-directory drift. Use conventional commit messages because releases and the changelog are generated from them.

For a patch release, update `develop` and run `npm run release:pr`. It prepares the version and changelog changes, validates them, commits them on `develop`, pushes it, and opens the only permitted pull request: `develop` → `main`. Run `npm run release:patch` only when you want to review the generated changes before creating that PR. Merge the release PR with a merge commit, then tag the updated `main` branch with `npm run release:tag`. Deployment runs on pushes to `main` after the merge.
