This is a pnpm-workspaces monorepo. Its EmDash CMS site is in `apps/site` and is built with Astro and a full admin UI.

## Commands

```bash
pnpm run dev                              # Start the site through Turborepo
pnpm run ci                               # Run repository guards, typecheck, and build
pnpm --filter @tiranicida-ca/site run build
pnpm --filter @tiranicida-ca/site exec emdash types
pnpm --filter @tiranicida-ca/site exec emdash seed seed/seed.json --validate
```

The admin UI is at `http://localhost:4321/_emdash/admin`.

## Key Files

| File                     | Purpose                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `apps/site/astro.config.mjs`       | Astro config with `emdash()` integration, database, and storage                    |
| `apps/site/src/live.config.ts`     | EmDash loader registration (boilerplate -- don't modify)                           |
| `apps/site/seed/seed.json`         | Schema definition + demo content (collections, fields, taxonomies, menus, widgets) |
| `apps/site/emdash-env.d.ts`        | Generated types for collections (auto-regenerated on dev server start)             |
| `apps/site/src/layouts/Base.astro` | Base layout with EmDash wiring (menus, search, page contributions)                 |
| `apps/site/src/pages/`             | Astro pages -- all server-rendered                                                 |

## Skills

Agent skills are in `.agents/skills/`. Load them when working on specific tasks:

- **building-emdash-site** -- Querying content, rendering Portable Text, schema design, seed files, site features (menus, widgets, search, SEO, comments, bylines). Start here.
- **creating-plugins** -- Building EmDash plugins with hooks, storage, admin UI, API routes, and Portable Text block types.
- **emdash-cli** -- CLI commands for content management, seeding, type generation, and visual editing flow.

## Rules

- All content pages must be server-rendered (`output: "server"`). No `getStaticPaths()` for CMS content.
- Image fields are objects (`{ src, alt }`), not strings. Use `<Image image={...} />` from `"emdash/ui"`.
- `entry.id` is the slug (for URLs). `entry.data.id` is the database ULID (for API calls like `getEntryTerms`).
- Always call `Astro.cache.set(cacheHint)` on pages that query content.
- Taxonomy names in queries must match the seed's `"name"` field exactly (e.g., `"category"` not `"categories"`).
