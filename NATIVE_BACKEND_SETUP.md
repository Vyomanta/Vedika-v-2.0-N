# Native PostgreSQL/Neon variant

See [DEPLOYMENT.md](DEPLOYMENT.md) for setup and validation. The same frontend is shipped in both repositories. Backend selection comes from frontend/deployment.json or an explicit matching LMS_BACKEND environment variable.

The native provider implements authentication, courses, syllabus editing, enrolments, assessments, history, document ingestion/search, and the resource catalog using PostgreSQL adapters. It never silently falls back to Frappe. Database migrations are explicit and additive. The schema contains the core LMS tables plus application support tables; table count alone does not establish performance or production readiness.

Use npm run db:migrate, npm run db:import-library when moving the existing resource catalog, and npm run admin:bootstrap with explicit administrator credentials. Database URLs and passwords stay in local/Vercel environments. Register the native Vercel OAuth callback URL and configure the voice/ingestion services separately.
