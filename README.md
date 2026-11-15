# Vedika

Vedika has two deployment variants with shared feature code: Frappe LMS and native PostgreSQL/Neon. `frontend/deployment.json` identifies this repository's backend and GitHub destination. Environment files remain local.

- [Deployment and readiness](DEPLOYMENT.md)
- [Feature and route map](PROJECT_MAP.md)
- [Machine-readable module map](frontend/architecture/feature-map.json)
- [Voice architecture requirements](AGENTS.md)

Set Vercel's **Root Directory to `frontend`**. Builds never run database migrations or create accounts. Follow the deployment document before releasing.

## Local development

Use Node 24, run `npm ci` in `frontend`, configure `.env.local`, run the explicit database migration, and start `npm run dev`. `npm run dev:voice` starts the dedicated voice process. The combined server is available with `npm run dev:combined`.

## Paired development

Keep the Frappe and Neon checkouts as sibling folders named `frappe` and `neon`. Implement common features once, then use:

```sh
node scripts/pair.cjs sync
node scripts/pair.cjs check
node scripts/pair.cjs install-hooks
node scripts/pair.cjs release --message "feat: describe the shared change"
```

Use `--peer <path>` when folders are elsewhere. Synchronization refuses conflicting uncommitted peer edits. It never copies environment files, local organization state, user profiles, dependency folders, or build outputs. A release validates both repositories and verifies both remote heads; it never force-pushes.

Frontend, styles, feature logic, tests, database adapters, and assets must match across variants. The deployment identity and secret values must differ where appropriate. Independent remote pushes are not an atomic transaction; a failed destination makes the paired release incomplete and must be retried.
