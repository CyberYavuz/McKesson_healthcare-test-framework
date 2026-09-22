# McKesson Healthcare Test Framework

A Playwright-based automation skeleton covering UI, API, database
(PostgreSQL) and BDD (Cucumber) test layers.

## Stack

- **UI & API:** [Playwright Test](https://playwright.dev)
- **BDD:** [Cucumber.js](https://cucumber.io) (Gherkin), steps drive Playwright
- **DB:** [Vitest](https://vitest.dev) + [`pg`](https://node-postgres.com) (PostgreSQL)
- **Env validation:** [zod](https://zod.dev)

## Folder structure

```
src/
  config/env.ts          # reads .env + validates it with zod
  ui/pages/               # Page Objects
  ui/tests/               # Playwright UI tests (*.spec.ts)
  api/clients/            # ApiClient (baseURL, headers, retries live here)
  api/schemas/            # zod response schemas
  api/tests/              # Playwright API tests (*.spec.ts)
  db/client.ts            # pg Pool singleton
  db/repositories/        # repository layer using parameterized queries
  db/sql/                 # schema Docker runs on container init
  db/tests/               # Vitest DB tests (*.test.ts)
  bdd/features/           # Gherkin scenarios
  bdd/steps/               # step definitions
  bdd/support/            # World + hooks (browser lifecycle, screenshot-on-fail)
```

Convention: Playwright tests use `*.spec.ts`, Vitest tests use `*.test.ts` —
the naming is intentionally different so the two runners never collide.

## Setup

```bash
npm install
cp .env.example .env
docker compose up -d      # local Postgres for DB tests (host port: 5433)
npx playwright install    # browser binaries
```

> **Why 5433 and not 5432:** many dev machines already run a native/local
> Postgres service on 5432. If the container tried to bind the same port,
> requests would silently go to the wrong Postgres and you'd get a
> confusing "password authentication failed" error. The container's
> internal port is still 5432; only the host side is mapped to 5433.

`APP_BASE_URL` and `API_BASE_URL` in `.env` are currently placeholders
(`example.com`, `jsonplaceholder.typicode.com`). Update them once the real
application URLs are known; tests read `baseURL` from config, there is no
hardcoded URL in the code.

> **Why `APP_BASE_URL` and not `BASE_URL`:** Vite/Vitest reserves the
> `BASE_URL` name for its own use (`import.meta.env.BASE_URL`, default
> `"/"`), and `dotenv.config()` does not override an already-set
> `process.env` value. If `BASE_URL` were used, DB tests running under
> Vitest would silently get Vite's `"/"` instead of the `.env` value, and
> env validation would fail.

## Running the tests

```bash
npm run test:unit   # pure unit tests (non-DB)
npm run test:db     # Postgres connectivity + repository tests (needs docker)
npm run test:api    # Playwright API tests
npm run test:ui     # Playwright UI tests (headless)
npm run test:ui:headed
npm run test:bdd    # Cucumber scenarios
npm test            # everything in sequence (CI also runs these as separate jobs)
```

Playwright HTML report: `npm run report:playwright`.

## Lint / format

```bash
npm run lint
npm run format
```

## CI

`.github/workflows/ci.yml` runs lint, db, api, ui and bdd tests as
**separate parallel jobs** — one failing doesn't stop the others from
reporting (not a chain). The UI and BDD jobs upload the Playwright/Cucumber
report as an artifact on failure.

## Adding new tests

- **UI:** write a Page Object under `src/ui/pages/` and use it in the test.
  Selectors belong in the page object, not the test.
- **API:** add a method to `ApiClient` for the new endpoint and validate the
  response with a zod schema under `src/api/schemas/`. Don't just cover the
  happy path — add at least one negative scenario (4xx).
- **DB:** add schema changes as a new migration file under `src/db/sql/`,
  write the repository with parameterized queries (never build SQL via
  string interpolation). Clean up any data you create in `afterEach`.
- **BDD:** use it only for scenarios with real domain value that the
  business would actually discuss in this language. Keep technical detail
  tests (edge cases, negative scenarios) in Playwright.

## Healthcare / compliance note

Since this is a healthcare portal project:

- Don't test with real patient data; generate synthetic data (e.g. `faker`).
- Make sure trace/screenshot/video recordings never contain PHI.
- Secrets (`.env`, credentials) must never be committed — `.gitignore`
  enforces this, but double-check with `git status` before pushing anyway.
