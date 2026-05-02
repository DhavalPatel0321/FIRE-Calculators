# FIRE Calculators

A deterministic Financial Independence / Retire Early planner for Traditional,
Coast, Barista, Lean, and Fat FIRE. Users enter one financial profile and see
all five targets, projected timelines, a shared growth chart, shareable scenario
URLs, and side-by-side scenario comparison.

## Current Status

v1 implementation is complete through F4 of [docs/work-plan.md](./docs/work-plan.md):

- Five FIRE variants from a shared input model.
- URL persistence and share links.
- Up to three scenario overlays on `/plan/compare`.
- MDX learn pages for FIRE basics, each variant, and safe withdrawal rates.
- SEO metadata, generated OG image, sitemap, and robots routes.
- Vercel Analytics mounted in the App Router layout.
- Playwright golden-path smoke test.

F5 deployment is pending Vercel authentication/linking in this local workspace.

## Routes

- `/` — landing page.
- `/plan` — planner with inputs, results, and growth chart.
- `/plan/compare` — side-by-side scenario comparison.
- `/learn` — explainer index.
- `/learn/fire-basics`
- `/learn/traditional-fire`
- `/learn/coast-fire`
- `/learn/barista-fire`
- `/learn/lean-fire`
- `/learn/fat-fire`
- `/learn/swr`

Metadata routes:

- `/opengraph-image`
- `/sitemap.xml`
- `/robots.txt`

## Development

Install dependencies:

```sh
npm install
```

Run the local dev server:

```sh
npm run dev -- --hostname 127.0.0.1 --port 3309
```

Run local checks:

```sh
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm run lint
```

Playwright uses port `3309` to avoid stale local servers on `3000`.

## Deployment

The app targets Vercel. To deploy from a fresh local workspace:

```sh
npx vercel login
npx vercel link
npx vercel --prod
```

Set `NEXT_PUBLIC_SITE_URL` to the production URL so canonical metadata, OG URLs,
sitemap entries, and robots output point at the deployed domain. Without that
environment variable, the app falls back to `https://fire-calculators.vercel.app`.

## Documentation

- [PRD.md](./PRD.md) — product requirements and v1/v2/v3 scope.
- [docs/work-plan.md](./docs/work-plan.md) — implementation checklist.
- [docs/formulas.md](./docs/formulas.md) — formula derivations.
- [docs/monte-carlo.md](./docs/monte-carlo.md) — deferred v2 simulation methodology.
