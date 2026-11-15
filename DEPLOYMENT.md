# Deployment and readiness

## Required order

1. Rotate the previously disclosed Gemini credentials and Google OAuth client secret at their providers. Removing disclosure in source does not revoke old credentials or remove historical copies.
2. Configure each project's local and Vercel environment independently. Local `.env.local` files have distinct JWT signing secrets; copy the correct secret into its corresponding Vercel project. Existing sessions must sign in again.
3. Run `npm ci`, `npm run check:config`, and the additive `npm run db:migrate` in each variant's `frontend` folder. Migrations preserve existing records and never fabricate student submissions. Take a provider backup before applying a migration to an established production database.
4. For native PostgreSQL, optionally run `npm run db:import-library` to copy the existing resource catalog additively, then run `npm run admin:bootstrap` with explicit `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` (at least 12 characters). The default bootstrap creates an LMS administrator in the default tenant. Set BOOTSTRAP_ADMIN_ROLE=super_admin explicitly for a separate platform administrator account. Existing account passwords and roles are not overwritten. The old development seeder requires explicit passwords and is not a production bootstrap path.
5. Run `npm run check:database`, `npm run check`, and `npm audit --audit-level=high` in both variants.
6. Deploy the secure voice and ingestion worker services, then deploy both Vercel projects with Root Directory `frontend` and the correct environment.
7. Perform live smoke checks with test accounts: password and Google login, course editing, quiz attempts, assignment submission/grading, PDF ingestion, voice interruption/transcription, and student/teacher/admin access. Local mocked browser checks do not prove external provider connectivity.

## Environment configuration

Common required names are `JWT_SECRET`, `GEMINI_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `NEXT_PUBLIC_VOICE_WS_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `B2_KEY_ID`, `B2_APPLICATION_KEY`, and `B2_BUCKET_NAME`. `NEXT_PUBLIC_VOICE_WS_URL` is a public **wss://** service URL, never a credential. Never put keys, passwords, or connection strings in a `NEXT_PUBLIC_*` variable.

Frappe additionally requires `FRAPPE_URL`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `DB_SSL`. Its existing RAG integration uses TiDB vector SQL. `DB_RESOURCES_NAME` selects the legacy resource catalog database.

Neon requires `DATABASE_URL`. Backend selection is explicit; an unavailable Neon database never falls back to Frappe or browser storage. PostgreSQL connections verify the provider's TLS certificate. The native support migration includes history, ingestion queue, audit, resource-catalog, and document-search support tables.

`LMS_BACKEND` may explicitly select `frappe` or `neon`; otherwise `deployment.json` determines it. Do not configure the opposite backend in a Vercel project. Do not synchronize secrets between variants. Configure both Vercel callback URLs in the Google OAuth client allowlist.

## Voice and ingestion services

The voice client streams 16 kHz 16-bit mono PCM over WebSocket, with dedicated local port 5001 first and current-host fallback. Incoming 24 kHz PCM is scheduled gaplessly and interruption stops queued audio. Browser Web Speech is not used as a replacement. Gemini keys stay in the voice process; browser connections use short-lived single-use Redis tickets. Both voice and frontend deployments must use the intended Redis service. Prefer separate voice/Redis environments when isolating production from testing.

The Next.js application does not itself deploy or start `voice-server.js` or the Python ingestion worker merely because Vercel builds its frontend. Deploy those processes explicitly using the supplied service configuration. For the ingestion worker, install `backend/requirements.txt`, set the selected backend's environment, and run `python backend/queue_worker.py`. The worker selects PostgreSQL or MySQL through `backend/database_connection.py`.

## Data continuity

Assessment definitions and rich syllabus data are imported from the existing source snapshots only when the corresponding database records do not exist. Existing records are preserved. Organization state is imported once from the configured legacy Redis key, or the local snapshot if no Redis state exists. No runtime success is returned after a failed assessment write. Instructor access is restricted to assigned courses, student identities come from verified sessions, and answer keys are removed from student assessment responses.

Business collections such as batches, jobs, certificates, notifications, and certificate configuration use durable tenant-scoped application tables. Their old browser-only data must be exported and imported deliberately if users have authored records stored only in a particular browser; servers cannot discover private localStorage across users' machines. Do not assume that a code deployment migrates those browser records.

## Checks and their limits

`npm test` exercises assessment authorization, grading, retry handling, database failure, PostgreSQL schema, and voice invariants. `npm run check:exports` checks existing module interfaces; `check:routes` protects existing route paths. `check:budgets` measures gzip bytes of JavaScript referenced in prerendered HTML, not full field Core Web Vitals or every asynchronous chunk. Collect mobile LCP, INP, CLS, API percentiles, and voice latency after deployment using real test sessions.

Browser tests run against a local production server using mocked backend/AI responses. No paid AI requests are needed for those tests. Live OAuth, database permissions, B2 ingestion, voice quality, and database restore/rollback still require configured provider checks.

## Readiness recorded during implementation

Both application databases were migrated and connectivity checked. The native administrator bootstrap completed without changing existing accounts. The source catalog import found zero source resource rows; this does not certify a populated library.

The owner confirmed that exposed Gemini keys and the Google OAuth secret were rotated. Local environment values and each Vercel project's environment still need to contain the replacement credentials. Never paste credentials into chat or commit them.

At validation time, both copied local environments were missing NEXT_PUBLIC_VOICE_WS_URL and B2_KEY_ID, B2_APPLICATION_KEY, B2_BUCKET_NAME. Retain the existing Render voice service, redeploy its updated authentication code, and supply its verified public wss URL. Both browser deployments use one-time voice tickets. Configure the retained voice service with the same Redis ticket store used by both deployments; this supports their distinct JWT signing secrets without exposing either secret to the browser. Separate Redis stores require separate voice services or an explicit multi-store setup.

Redeploy the Frappe backend and ensure grant_question_perm.py succeeds before exposing it. It now revokes direct student question/submission access, and grant_enrollment_perm.py revokes Guest enrollment writes. Verify permissions with actual student and instructor accounts against the upstream Frappe URL, not only the Next.js proxy.

Remaining production acceptance includes live OAuth/Frappe session behavior, organization administrator provisioning, course/enrollment permissions, B2 uploads and worker ingestion, authenticated full-duplex voice/barge-in, and backup/restore testing. Existing metadata-only organization creation does not itself provision backend user accounts. These are release blockers for a blanket production-readiness claim.

Progress now uses tenant-scoped durable SQL records instead of email-only Redis keys shared across releases. Export and import existing Redis progress into the correct tenant explicitly before go-live; ambiguous historical tenant ownership must not be guessed. Notification read receipts are per user, including broadcast notifications.
