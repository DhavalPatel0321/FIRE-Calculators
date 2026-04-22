# Claude Handoff

Last updated: 2026-04-22
Current stop point on `main`: `399df24`

## Read this first on resume

1. Read this file.
2. Read [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1).
3. Re-read the v1-authoritative parts of [PRD.md](/Users/dhavalpatel/projects/FIRE-Calculators/PRD.md:1):
   - §1 v1 feature matrix
   - §8 UX / information architecture
   - §10 v1 scope

At the end of each session for this project, replace this file with a fresh handoff that matches the latest pushed commit and next unchecked work-plan item.

## Current state

- Foundation is complete through A3.
- Calc core is complete through B8.
- Planner UI is through C4: `/plan` now renders the full input panel, five result cards, and the portfolio growth chart (Recharts AreaChart with per-variant reference lines).
- The next required product commit is **C5**:
  `feat(ui): landing page + header/footer`
- Do not start D1 until C5 is committed, pushed, and CI is green.

Current checked items live in [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1):

- A1-A3: complete
- B1-B8: complete
- C1-C4: complete
- C5-F5: not started

## Latest pushed commits

- `4aea0ce` `feat(ui): input panel component wired to store`
- `65fb482` `feat(ui): result cards (5 calculator variants)`
- `399df24` `feat(ui): portfolio growth chart`

Latest confirmed green GitHub Actions runs:

- B8: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24759041195`
- C1: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24780716699`
- C2: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24781230713`
- C3: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24781763521`
- C4: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24795521643`

## What already exists

- Next.js 15 App Router scaffold with Tailwind and shadcn/ui primitives.
- Vitest (with `@vitejs/plugin-react` for TSX tests), Playwright, and GitHub Actions workflow.
- Pure calc module under [src/lib/calc](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/calc:1):
  - shared types/defaults/SWR presets, solver, all variants, projection, scenario aggregator, reference scenarios.
  - `computeAllVariants(inputs)` and `projectPortfolio(inputs, years)` are the two entry points the UI consumes.
- Zustand scenario store at [src/store/scenario.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/store/scenario.ts:1): `inputs` seeded from `DEFAULT_INPUTS`, `setInput(key, value)`, `resetInputs()`.
- `/plan` page at [src/app/plan/page.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/app/plan/page.tsx:1):
  - Server shell with `plan-page`, `plan-inputs`, `plan-results`, `plan-chart` data-testids.
  - Sections render `<InputPanel />`, `<ResultCards />`, `<GrowthChart />` respectively.
- `<InputPanel />` — Personal/Financial/Assumptions/Advanced groups, percent sliders, Reset.
- `<ResultCards />` — canonical-order five-card grid, "Already FI" branch.
- `<GrowthChart />` — Recharts `AreaChart` over a `computeChartHorizon()` window (at least 30 years), five dashed `ReferenceLine`s pulled from `VARIANT_THEME.accentHex`, compact-currency Y axis, currency tooltip, and a legend row.
- `VARIANT_ORDER` + `VARIANT_THEME` at [src/components/plan/variant-theme.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/plan/variant-theme.ts:1) remain the single source of truth for variant color + copy.
- TSX tests pattern: React Testing Library + jsdom. Wrap direct `useScenarioStore.getState().setInput(...)` calls made while a component is rendered in `act()`. For Recharts tests, mock `ResponsiveContainer` with a sized div (see [src/components/plan/__tests__/growth-chart.test.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/plan/__tests__/growth-chart.test.tsx:1) for the pattern).

The home page (`/`) is still the placeholder landing page — it gets rebuilt in C5. There is no site-wide header or footer yet.

## Important decisions already made

### Formula authority

Use `PRD.md` + `docs/formulas.md` as the source of truth for math.

### Readability preference

The user explicitly asked for human-readable variable names, including in tests, and for concise documentation comments where logic is non-obvious. Prefer `currentInvested`, `annualContribution`, `expectedRealReturn`; keep comments short and high-signal.

### Commit discipline

- Follow the prescribed sequence in `docs/work-plan.md`.
- Update the matching checkbox in the same commit that implements that item.
- Wait for CI to go green before starting the next unchecked item.
- No scope drift into v2/v3.

### UI decisions locked in by C1-C4

- State library: **Zustand** via `useScenarioStore`. URL-param sync is a D1 concern — not C5.
- Default scenario shape is `DEFAULT_INPUTS`; do not redefine defaults elsewhere.
- Page shells (e.g. `/plan/page.tsx`) stay server components. Client-only pieces live in `src/components/**` with `"use client"`.
- Variant colors come from `VARIANT_THEME`, always.
- Currency is always formatted with `Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })` (compact variant in the Y axis).
- Chart horizon min is 30 years; span is otherwise `targetRetirementAge - currentAge`. Defined in `computeChartHorizon`.

## Tooling notes

Use Node 20:

```sh
NODE20=$(npx --yes node@20 -p "process.execPath")
export PATH="$(dirname "$NODE20"):$PATH"
```

- `create-next-app@latest` now scaffolds Next 16 and refused this non-empty repo. A1 used `create-next-app@15.5.15` in a temp dir and merged the scaffold in.
- `gh` CLI is installed and authenticated.
- Local dev verification: `npm run dev -- --port 3303 --hostname 127.0.0.1`, then `curl http://127.0.0.1:3303/plan`. Full planner renders: inputs, five cards, and the growth chart with DEFAULT_INPUTS projecting to ~$5,748,594 at age 65.
- Recharts is already installed (v3.8.1). No new deps expected for C5.

## Testing notes

- `src/lib/calc` coverage was brought above the required threshold during B8.
- TSX component tests run under Vitest via `@vitejs/plugin-react`. React Testing Library + jsdom works. When asserting the effect of direct `useScenarioStore.getState().setInput(...)` calls from inside a test where a component is rendered, wrap them in `act()`.
- Recharts tests must mock `ResponsiveContainer` because jsdom has zero layout. Example in `growth-chart.test.tsx`.
- Last local C4 verification:
  - `npx vitest run` — 16 files / 56 tests passing
  - `npm run typecheck`
  - `npm run build` — `/plan` is now 119 kB First Load JS (Recharts cost)
  - `npm run lint`
  - Manual dev-server smoke: end-balance reads `$5,748,594` for `DEFAULT_INPUTS`.
- Vitest coverage config still only tracks `src/lib/calc/**`.

## Files to inspect before starting C5

- [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1)
- [PRD.md](/Users/dhavalpatel/projects/FIRE-Calculators/PRD.md:1) §2 problem + §3 target users (landing copy) + §8 IA (top-nav links)
- [docs/wireframes.html](/Users/dhavalpatel/projects/FIRE-Calculators/docs/wireframes.html:1) — look at both the landing and planner top-nav sections
- [src/app/page.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/app/page.tsx:1) — current placeholder
- [src/app/layout.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/app/layout.tsx:1) — where the header/footer will mount
- [src/app/plan/page.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/app/plan/page.tsx:1) — the existing ad-hoc header at the top of `/plan` will probably collapse into the shared header

## C5 restart brief

Implement exactly:

`feat(ui): landing page + header/footer`

Expected deliverables:

- Site header component (e.g. `src/components/site/site-header.tsx`) with:
  - Product name / logo, nav links to `/`, `/plan`, `/learn` (the last two routes exist or are about to — `/learn` lands in E1; a linked stub is OK).
  - "Start planning" CTA → `/plan` when on `/`.
- Site footer component (`src/components/site/site-footer.tsx`) with:
  - Copyright, repo link (use `https://github.com/DhavalPatel0321/FIRE-Calculators`), non-advice disclaimer.
- Mount both in `src/app/layout.tsx` so every page inherits them. The existing `TooltipProvider` wrapper stays.
- Rebuild `src/app/page.tsx` as the landing page. Must cover (from PRD §2-§4):
  - A hero section — one-sentence value prop + primary CTA to `/plan`.
  - A "5 variants, one planner" explainer using `VARIANT_ORDER` + `VARIANT_THEME` so colors stay consistent with the rest of the app.
  - A short "what you get in v1" list (shared inputs, SWR slider, URL-shareable scenarios, Lighthouse ≥ 90) pulled from §4.2 / §10.
  - Secondary CTA at the bottom.
- `/plan` should keep rendering, but its in-page header ("FIRE Calculators" mini-label) should be removed or reconciled with the site header so they don't double up.
- Add `data-testid="site-header"` and `data-testid="site-footer"` on the new wrappers for future e2e.

Tests:

- A small RTL test covering the site header (renders brand + the three nav links with the expected `href`s).
- A small RTL test for the landing page hero (headline present, primary CTA links to `/plan`).

Out of scope for C5:

- `/learn` route implementation — E1.
- MDX setup — E1.
- SEO metadata / OG images — F1.
- URL sync / share button — D1.

## Working tree notes

Tracked files are clean at the stop point.

Pre-existing untracked files to leave alone unless explicitly asked:

- `FIRE-PRD.html`
- `docs/wireframes.html`
