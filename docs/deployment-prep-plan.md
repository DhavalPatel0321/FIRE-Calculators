# Deployment Prep Plan

Last updated: 2026-05-02
Status: pre-deploy checklist for F5

## Goal

Finish the remaining non-code prep for `F5` so the final production deploy can
be executed quickly once Vercel access is available in the local workspace.

This document does **not** replace the unchecked `F5` item in
[docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1).
It is the runbook for getting that last item over the line.

## What is already done

- Product implementation is complete through `F4`.
- README already documents local setup, checks, and the basic Vercel commands.
- The app already has:
  - metadata routes (`/opengraph-image`, `/sitemap.xml`, `/robots.txt`)
  - `NEXT_PUBLIC_SITE_URL` support for canonical URLs and OG metadata
  - Vercel Analytics mounted in the root layout
  - passing unit, e2e, typecheck, build, and lint gates at the current stop point

## Remaining deployment-prep checklist

### 1. Access and project ownership

- Confirm who owns the Vercel project and which team/account should hold the production deployment.
- Confirm whether the deploy should use the default `*.vercel.app` domain or an existing custom domain.
- Authenticate the local workspace with Vercel:

```sh
npx vercel login
```

- Verify access:

```sh
npx vercel whoami
```

### 2. Link the repo to the correct Vercel project

- Link this workspace to the intended Vercel project:

```sh
npx vercel link
```

- Confirm `.vercel/project.json` points at the correct project and team after linking.
- If a project already exists, make sure it matches this repo and is not an unrelated older app.

### 3. Production environment variables

- Set `NEXT_PUBLIC_SITE_URL` in Vercel to the final production origin.
- If using only the default Vercel domain, set it to that exact `https://...vercel.app` URL.
- If using a custom domain, set it to the canonical custom origin instead.
- Confirm there are no other runtime environment variables required for v1.

### 4. Local preflight before first production deploy

Run the full local gate set from a Node 20 shell:

```sh
NODE20=$(npx --yes node@20 -p "process.execPath")
export PATH="$(dirname "$NODE20"):$PATH"

npm run typecheck
npm run test
npm run test:e2e
npm run build
npm run lint
```

- Only proceed if all checks are green.
- If any dependency or lockfile drift appears, fix it before deployment rather than pushing a broken deploy candidate.

### 5. Preview verification

- Create a preview deployment first:

```sh
npx vercel
```

- Verify the preview app manually:
  - `/`
  - `/plan`
  - `/plan/compare`
  - `/learn`
  - `/learn/fire-basics`
  - `/learn/traditional-fire`
  - `/learn/coast-fire`
  - `/learn/barista-fire`
  - `/learn/lean-fire`
  - `/learn/fat-fire`
  - `/learn/swr`
  - `/sitemap.xml`
  - `/robots.txt`
- Confirm share URLs still hydrate correctly on the deployed preview.
- Confirm comparison URLs still hydrate correctly with multiple `sN.*` scenarios.

### 6. Production rollout

- Deploy production:

```sh
npx vercel --prod
```

- Capture the final production URL.
- If a custom domain is expected, confirm DNS/domain attachment is complete before calling F5 done.

### 7. Post-deploy validation

- Re-run the Playwright golden path against production if practical.
- Manually verify:
  - metadata and OG image resolve from the production origin
  - sitemap and robots point at the correct canonical host
  - Vercel Analytics is present in production
  - `/plan` is usable on desktop and mobile widths
- Run Lighthouse on the production `/plan` URL and confirm the v1 target remains met.

### 8. Final repo updates for F5

- Update [README.md](/Users/dhavalpatel/projects/FIRE-Calculators/README.md:1) with the live production URL.
- Update [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1) and check off `F5` in the same commit that records the successful production deployment.
- Refresh [docs/claude-handoff.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/claude-handoff.md:1) so the next session sees that deployment is complete.

## Suggested execution order

1. Authenticate and link the correct Vercel project.
2. Set `NEXT_PUBLIC_SITE_URL`.
3. Re-run the full local gate set.
4. Verify a preview deployment.
5. Deploy production.
6. Update README/work-plan/handoff in the final F5 commit.

## Known blocker at the current stop point

The only known blocker is Vercel authentication/linking in this local
workspace. Product code is otherwise in place for a v1 deployment candidate.
