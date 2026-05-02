# Claude Handoff

Last updated: 2026-05-02
Current stop point on `main`: deployment-prep docs commit (last completed product commit: F4)

> Verified on 2026-05-02 against the current tree: F4 is complete, local gates are green, README has been refreshed for the current app, a deployment prep runbook now exists, and the next required product commit remains **F5**. Production deployment is blocked on Vercel authentication/linking in this local workspace.

## Read this first on resume

1. Read this file.
2. Read [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1).
3. Re-read the v1-authoritative parts of [PRD.md](/Users/dhavalpatel/projects/FIRE-Calculators/PRD.md:1):
   - §4.2 v1 features (`/learn/*` MDX explainers)
   - §6.6 SWR explainer copy
   - §10 v1 scope
4. Read [docs/deployment-prep-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/deployment-prep-plan.md:1) before attempting F5.

At the end of each session for this project, replace this file with a fresh handoff that matches the latest pushed commit and next unchecked work-plan item.

## Current state

- Track A (Foundation), Track B (Calc core), Track C (Planner UI), and Track D (Persistence + Compare) are complete.
- `/plan` hydrates from URL, debounces store-driven URL updates via `history.replaceState`, has a Copy-share-URL button, formats $ amounts with comma separators, and links to `/plan/compare`.
- `/plan/compare` overlays up to 3 scenarios with their own slate/emerald/violet palette, hydrates from `?sN.*` URL params, and re-keys slots after removal.
- The next required product commit is **F5**:
  `chore: deploy to Vercel (production) + README update`
- `npx vercel whoami` found no existing credentials and started a device login flow, so production deploy could not be completed autonomously.
- Deployment prep steps are documented in [docs/deployment-prep-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/deployment-prep-plan.md:1).

Current checked items live in [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1):

- A1-A3: complete
- B1-B8: complete
- C1-C5: complete
- D1, D2: complete
- E1-E2: complete
- F1-F4: complete
- F5: not started

## Latest pushed commits

- `78b974b` `feat(url): URL-encoded scenario state + share button`
- `f6e637e` `fix(inputs): format $ amounts with commas + strip leading zeros`
- `e3d9acd` `feat(compare): /plan/compare side-by-side scenario overlay`
- `bfe4592` `fix(nav): improve compare and learn route continuity`
- this E1 commit `feat(content): add MDX learn basics`
- this E2 commit `feat(content): add FIRE variant explainers`
- this F1 commit `feat(seo): add metadata routes and OG image`
- this F2 commit `feat(a11y): improve planner accessibility`
- this F3 commit `feat(analytics): add Vercel Analytics`
- this F4 commit `test(e2e): add golden path smoke`
- this README update commit `docs: refresh README for v1 app`
- this deployment-prep docs commit `docs: add deployment prep plan`

Latest confirmed green GitHub Actions runs:

- D1: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24934280814`
- input formatting: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24934369126`
- D2: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24934690173`

## What already exists

- Next.js 15 App Router + Tailwind + shadcn/ui. Fonts via `next/font`.
- Vercel Analytics is mounted in the root layout via `@vercel/analytics/next`.
- Vitest (with `@vitejs/plugin-react` for TSX tests), Playwright, GitHub Actions workflow.
- Playwright golden path lives at `e2e/golden-path.spec.ts`; config uses local port 3309 to avoid stale dev-server conflicts on 3000.
- Pure calc module under [src/lib/calc](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/calc:1):
  - types, defaults, SWR presets, solver, all variants, projection, scenario aggregator, reference scenarios.
  - Entry points: `computeAllVariants(inputs)`, `projectPortfolio(inputs, years)`, plus per-variant exports.
- URL serialization at [src/lib/url](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/url:1):
  - `scenario.ts` — `encodeScenario` / `decodeScenario` for a single `FireInputs`.
  - `compare.ts` — `encodeCompareScenarios` / `decodeCompareScenarios` for up to `MAX_COMPARE_SCENARIOS` slots, plus `defaultLabelForIndex`. Builds on top of the per-scenario encoder, namespaces fields with `sN.`.
- Zustand scenario store at [src/store/scenario.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/store/scenario.ts:1): `inputs` (from `DEFAULT_INPUTS`), `setInput(key, value)`, `applyInputs(partial)`, `resetInputs()`.
- Routes:
  - `/` — landing page (hero + five-variant strip + v1 features + CTA).
  - `/plan` — planner (inputs + result cards + growth chart). Mounts `<ScenarioUrlSync />` for URL hydration / replaceState. Header has a "Compare scenarios" CTA.
  - `/plan/compare` — server shell mounting `<CompareView />` (client). Up to 3 scenarios via `useReducer` (`compareReducer` + `initialCompareState`), URL-synced through `compare.ts`.
- `/learn` — MDX-backed learn index listing FIRE basics, Traditional, Coast, Barista, Lean, Fat, and SWR explainers.
- `/learn/fire-basics` — MDX explainer page covering FIRE basics, the 4% rule, the five-variant spectrum, and what `/plan` does.
- `/learn/traditional-fire`, `/learn/coast-fire`, `/learn/barista-fire`, `/learn/lean-fire`, `/learn/fat-fire`, `/learn/swr` — MDX explainer pages aligned to the v1 formulas and SWR guidance.
- `/opengraph-image`, `/sitemap.xml`, `/robots.txt` — metadata routes for social previews and indexing.
- Site chrome at [src/components/site](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/site:1) (`SiteHeader`, `SiteFooter`), mounted in [src/app/layout.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/app/layout.tsx:1).
- Planner components at [src/components/plan](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/plan:1):
  - `InputPanel` — Personal/Financial/Assumptions/Advanced. `<NumberField />` is a draft-aware text input (`type="text"`) that displays thousands separators via `formatNumberDisplay` and sanitizes via `sanitizeNumberInput`. **Don't revert to `type="number"`** — that's what allowed the leading-zero bug. Sliders use native `input type="range"` through `src/components/ui/slider.tsx` for accessible names and keyboard behavior.
  - `ResultCards`, `GrowthChart` (with `REFERENCE_LABEL_POSITION = "insideTopRight"`, exported and regression-tested), `ScenarioUrlSync`, `CopyUrlButton`.
  - `variant-theme.ts` — `VARIANT_ORDER`, `VARIANT_THEME` (single source of truth for variant colors). Used by ResultCards, GrowthChart, and the landing page.
  - `scenario-palette.ts` — `SCENARIO_PALETTE` (slot 1 slate, slot 2 emerald, slot 3 violet). **Distinct from VARIANT_THEME.** Content pages generally do not need this; D2 uses it.
  - `compare-state.ts` — `compareReducer`, `initialCompareState`, `CompareState`, `CompareAction`. Re-keys remaining scenarios after a remove so ids stay `s1..sN` with no gaps.
  - `compare-view.tsx` — the client `<CompareView />`. Owns the reducer + URL sync.

Stable data-testids (content / F4 can rely on these):

- Layout: `site-header`, `site-header-brand`, `site-header-nav-home|plan|learn`, `site-header-cta`, `site-footer`, `site-footer-repo`.
- Landing: `landing-page`, `landing-headline`, `landing-cta-primary`, `landing-cta-secondary`, `landing-cta-footer`, `landing-variants`, `landing-variant-<variant>`.
- Planner shell: `plan-page`, `plan-inputs`, `plan-results`, `plan-chart`, `plan-compare-link`.
- Inputs: `input-<field>`, `slider-<field>`, `slider-value-<field>`, `reset-inputs`, `copy-url`.
- Results: `result-cards-grid`, `result-card-<variant>`, `result-number-<variant>`, `result-timeline-<variant>`.
- Chart: `growth-chart`, `growth-chart-legend`, `growth-chart-legend-<variant>` (carries `data-active="true"|"false"`), `growth-chart-toggle-<variant>`, `growth-chart-end-balance`.
- Compare: `compare-page`, `compare-scenarios`, `compare-empty`, `compare-add-from-planner`, `compare-edit-link`, `compare-scenario-card-<index>`, `compare-remove-<id>`, `compare-chart`, `compare-chart-empty`.

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
- Interleaving a targeted `fix(...)` between work-plan items is fine when the user explicitly asks; it doesn't get its own checkbox but must not block the next queued item.

### UI / state decisions locked in by C1-D2

- State library: **Zustand** for the planner; **`useReducer`** for compare. URL sync is one-way write (state → URL via `history.replaceState`) plus a one-shot URL → state hydration on mount.
- Default scenario shape is `DEFAULT_INPUTS`.
- Page shells stay server components. Client-only pieces live in `src/components/**` with `"use client"`.
- Variant colors come from `VARIANT_THEME`; compare-slot colors come from `SCENARIO_PALETTE`.
- Currency is always formatted with `Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })`. The number-field display uses a sibling formatter without `style: "currency"` so the prefix `$` stays inside the input chrome.
- Chart horizon: `computeChartHorizon(inputs)` returns `max(targetRetirementAge - currentAge, 30)`.
- Reference-line labels stay inside the plot area via `REFERENCE_LABEL_POSITION` (regression-tested).
- Per-variant chart visibility is **view preference, not scenario state** — must not be serialized into URL or comparison overlays.
- `<NumberField />` is a draft-aware text input. Don't revert to `type="number"`.

## Tooling notes

Use Node 20:

```sh
NODE20=$(npx --yes node@20 -p "process.execPath")
export PATH="$(dirname "$NODE20"):$PATH"
```

- `gh` CLI is installed and authenticated.
- Local dev verification: `npm run dev -- --port 3309 --hostname 127.0.0.1`. `/plan/compare` shows the empty state by default; `?s1.currentAge=33&s2.currentAge=45&s2.label=Late+saver` hydrates two cards on mount; "Add current planner scenario" pulls the live `/plan` store into a new slot and disables once three slots are filled.
- MDX support is installed and wired through `@next/mdx@15.5.15`, `@mdx-js/loader`, `@mdx-js/react`, and `remark-gfm`. Keep `@next/mdx` pinned to the app's Next 15 line; the latest 16.x package produced invalid Turbopack loader config with Next 15.5.15.

## Testing notes

- `src/lib/calc` coverage was brought above the required threshold during B8.
- TSX component tests run under Vitest via `@vitejs/plugin-react`. React Testing Library + jsdom works.
- For Recharts tests, mock `ResponsiveContainer` with a sized div. The same mock pattern works for `<CompareView />`.
- For `<ScenarioUrlSync />` and `<CompareView />` tests, `vi.useFakeTimers()` is required because the URL update is debounced. Use `window.history.replaceState` to seed the URL before mount.
- Last local verification (after F4):
  - `npx vitest run` — 26 files / 130 tests passing
  - `npm run test:e2e` — 1 Chromium test passing
  - `npm run typecheck`
  - `npm run build` — `/plan` 280 kB, `/plan/compare` 278 kB
  - `npm run lint`
- Vitest coverage config still only tracks `src/lib/calc/**`.

## Files to inspect before starting F5

- [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1)
- [README.md](/Users/dhavalpatel/projects/FIRE-Calculators/README.md:1)
- [docs/deployment-prep-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/deployment-prep-plan.md:1)
- Vercel project/link status via `vercel` CLI if available

## F5 restart brief

Implement exactly:

`chore: deploy to Vercel (production) + README update`

Expected deliverables:

- Deploy production to Vercel if the project is linked and credentials are available.
- README is already updated with current setup, scripts, routes/features, and deployment instructions. Add the production URL after deployment succeeds.
- Follow [docs/deployment-prep-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/deployment-prep-plan.md:1) as the runbook for linking, preview verification, rollout, and post-deploy checks.
- Tests:
  - Existing unit/type/build/lint gates stay green.

Out of scope for F5:

- New product features beyond the v1 checklist.

## Working tree notes

Tracked files are clean at the stop point.

Pre-existing untracked files to leave alone unless explicitly asked:

- `FIRE-PRD.html`
- `docs/wireframes.html`
