# Railway deployment — TaskFlow

This describes the deployment setup. It does not create Railway services.

## Architecture

- **taskflow-web**: Next.js (public Railway HTTPS domain), GitHub source `frhandev/taskflow`, **Root Directory `/frontend`**.
- **taskflow-api**: ASP.NET Core 10 (private only), same source, **Root Directory `/backend/Taskflow.Api`**, Dockerfile auto-detected, port **8080**.
- **Postgres**: Railway PostgreSQL database (private only), same Railway project/environment.

Do **not** generate public domains or TCP proxies for the API or database. Keep public domains only on `taskflow-web`. Use Railway's private DNS and service reference variables.

## Railway variables

For `taskflow-api`:
- `ASPNETCORE_ENVIRONMENT=Production`
- `ASPNETCORE_URLS=http://0.0.0.0:8080`
- `PORT=8080`
- `DataProtection__KeyRingPath=/app/keys`
- `ConnectionStrings__DefaultConnection=Host=${{Postgres.PGHOST}};Port=${{Postgres.PGPORT}};Database=${{Postgres.PGDATABASE}};Username=${{Postgres.PGUSER}};Password=${{Postgres.PGPASSWORD}}`

For `taskflow-web`:
- `BACKEND_INTERNAL_URL=http://${{taskflow-api.RAILWAY_PRIVATE_DOMAIN}}:8080`
- `NODE_ENV=production`

Reference variable names must match the actual names of your Railway services. Railway provides service variables at both build time and runtime; `next.config.ts` requires `BACKEND_INTERNAL_URL` when `next build` runs. The private DNS is available at *runtime*, not during the build itself.

## Data Protection volume (required before starting API)

Attach a Railway Volume to `taskflow-api` with mount path `/app/keys`. The production app intentionally refuses to start without that directory. The volume must survive redeploys to avoid invalidating auth cookies.

Railway volumes mount as root. If the service runs as a non-root UID and gets permission errors, configure appropriate volume permissions or, if required by Railway, set `RAILWAY_RUN_UID=0` with the associated security tradeoff. Limit volume access and enable backups. `PersistKeysToFileSystem` does not automatically encrypt key files at rest; consider a dedicated key-encryption solution for stronger production assurance.

Railway services with volumes cannot use multiple replicas, and redeploys of volume-attached services can involve short downtime.

## Build / start configuration

- Backend: Dockerfile (automatic detection at service root); image starts `dotnet Taskflow.Api.dll`.
- Backend health-check path: `/api/health` (liveness endpoint, not a database readiness check).
- Frontend: default Railpack/Next.js build; start with `npm run start`, listening on Railway's assigned public port (verify `PORT`).
- Watch paths (optional): `/frontend/**` for web, `/backend/Taskflow.Api/**` for API.

## Database migrations — pending release step

Do **not** run EF migrations during Docker image build: Railway private networking is not available during build. Use a deliberate, separately executed migration deployment/job that can access the private DB, backed up before any changes. Do not replace or reset the local PostgreSQL database and never check credentials into Git.

Verify `__EFMigrationsHistory`, `Tasks`, `AspNetUsers`, and the other Identity tables before enabling real traffic.

## Do not mark production complete until

1. Backend image builds and runs with its volume and DB credentials.
2. The migrations are applied to the **Railway** database.
3. The API is reachable from the web service over private DNS; `/api/health` succeeds.
4. The public HTTPS frontend works with same-origin `/api` rewrites.
5. Register/Login/Logout, cookies, CSRF rejection, user-owned CRUD and user isolation pass.
6. Auth survives backend redeploy and key volume persistence is confirmed.
7. Test a real 429 and verify the rate limit is partitioned per *client* rather than per shared Next.js proxy IP (trusted-forwarded-header configuration is deployment-specific).
8. `dotnet build`, `npm run lint`, `npm run build` pass and no secrets are committed.
