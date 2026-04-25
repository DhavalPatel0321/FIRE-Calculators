# Claude Handoff

Last updated: 2026-04-25
Current stop point on `main`: `f6e637e`

## Read this first on resume

1. Read this file.
2. Read [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1).
3. Re-read the v1-authoritative parts of [PRD.md](/Users/dhavalpatel/projects/FIRE-Calculators/PRD.md:1):
   - §4.2 v1 features (side-by-side scenario comparison)
   - §5 shared `FireInputs` contract
   - §10 v1 scope

At the end of each session for this project, replace this file with a fresh handoff that matches the latest pushed commit and next unchecked work-plan item.

## Current state

- Track A (Foundation), Track B (Calc core), Track C (Planner UI), and Track D step 1 are complete.
- `/plan` now hydrates from the URL on load, debounces store-driven URL updates via `history.replaceState`, and exposes a Copy-share-URL button next to Reset.
- Number inputs were also rebuilt to display thousands separators and never leak leading zeros (`f6e637e`); `formatNumberDisplay` and `sanitizeNumberInput` are exported with regression tests.
- The next required product commit is **D2**:
  `feat(compare): /plan/compare side-by-side scenario overlay`
- Do not start E1 until D2 is committed, pushed, and CI is green.

Current checked items live in [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1):

- A1-A3: complete
- B1-B8: complete
- C1-C5: complete
- D1: complete
- D2-F5: not started

## Latest pushed commits

- `49a4ce6` `feat(chart): toggleable reference lines per variant`
- `78b974b` `feat(url): URL-encoded scenario state + share button`
- `f6e637e` `fix(inputs): format $ amounts with commas + strip leading zeros`

Latest confirmed green GitHub Actions runs:

- C5: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24796024000`
- chart label fix: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24796379218`
- chart variant toggles: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24796513693`
- D1: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24934280814`
- input formatting: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24934369126`

## What already exists

- Next.js 15 App Router + Tailwind + shadcn/ui. Fonts via `next/font`.
- Vitest (with `@vitejs/plugin-react` for TSX tests), Playwright, GitHub Actions workflow.
- Pure calc module under [src/lib/calc](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/calc:1):
  - types, defaults, SWR presets, solver, all variants, projection, scenario aggregator, reference scenarios.
  - Entry points the UI uses: `computeAllVariants(inputs)` and `projectPortfolio(inputs, years)`.
- URL serialization at [src/lib/url/scenario.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/url/scenario.ts:1):
  - `encodeScenario(inputs)` — emits a `URLSearchParams`, omits fields equal to `DEFAULT_INPUTS`, drops undefined/non-finite numbers.
  - `decodeScenario(params)` — returns `Partial<FireInputs>`, drops unknown keys, coerces numerics, rejects NaN/Infinity.
  - **Reuse this module for D2** — comparison scenarios should serialize through the same encoder so saved scenarios stay diff-friendly.
- Zustand scenario store at [src/store/scenario.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/store/scenario.ts:1): `inputs` (from `DEFAULT_INPUTS`), `setInput(key, value)`, `applyInputs(partial)`, `resetInputs()`.
- Routes:
  - `/` — landing page (hero + five-variant strip + v1 features + CTA).
  - `/plan` — planner (inputs + result cards + growth chart). Mounts `<ScenarioUrlSync />` for URL hydration / replaceState.
  - `/plan/compare` — does not exist yet (D2).
  - `/learn` — does not exist yet; header and landing link to it (E1 will create it).
- Site chrome at [src/components/site](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/site:1) (`SiteHeader`, `SiteFooter`), mounted in [src/app/layout.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/app/layout.tsx:1).
- Planner components at [src/components/plan](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/plan:1):
  - `InputPanel` — Personal/Financial/Assumptions/Advanced groups.
    - `<NumberField />` is now a draft-aware text input that displays thousands separators (`formatNumberDisplay`) when unfocused and sanitizes via `sanitizeNumberInput` (digits-only, leading zeros stripped via numeric coercion). Tests pin both helpers.
    - Header has Reset + `<CopyUrlButton />`.
  - `ResultCards` — canonical-order five-card grid, "Already FI" branch.
  - `GrowthChart` — Recharts `AreaChart` over `computeChartHorizon()` horizon, five dashed `ReferenceLine`s with toggle checkboxes in the legend (local view state; **not** scenario-serialized).
  - `ScenarioUrlSync` — invisible client component; `useEffect` on mount decodes `window.location.search` and calls `applyInputs`. A second effect debounces store-driven `history.replaceState` (~150 ms).
  - `CopyUrlButton` — `navigator.clipboard.writeText(window.location.href)` with a 1.5 s "Copied!" flash; fails silently if clipboard rejects.
  - `variant-theme.ts` — `VARIANT_ORDER`, `VARIANT_THEME` (accent hex + classes + tagline). Single source of truth for variant colors.
  - `REFERENCE_LABEL_POSITION` is exported from `growth-chart.tsx` and locked to `"insideTopRight"` by a regression test — don't move it back to `"right"`.

Stable data-testids (D2 / F4 can rely on these):

- Layout: `site-header`, `site-header-brand`, `site-header-nav-home|plan|learn`, `site-header-cta`, `site-footer`, `site-footer-repo`.
- Landing: `landing-page`, `landing-headline`, `landing-cta-primary`, `landing-cta-secondary`, `landing-cta-footer`, `landing-variants`, `landing-variant-<variant>`.
- Planner shell: `plan-page`, `plan-inputs`, `plan-results`, `plan-chart`.
- Inputs: `input-<field>`, `slider-<field>`, `slider-value-<field>`, `reset-inputs`, `copy-url`.
- Results: `result-cards-grid`, `result-card-<variant>`, `result-number-<variant>`, `result-timeline-<variant>`.
- Chart: `growth-chart`, `growth-chart-legend`, `growth-chart-legend-<variant>` (carries `data-active="true"|"false"`), `growth-chart-toggle-<variant>`, `growth-chart-end-balance`.

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

### UI / state decisions locked in by C1-D1

- State library: **Zustand** via `useScenarioStore`. URL sync is one-way write (store → URL via `history.replaceState`) plus a one-shot URL → store hydration on mount.
- Default scenario shape is `DEFAULT_INPUTS`.
- Page shells stay server components. Client-only pieces live in `src/components/**` with `"use client"`.
- Variant colors come from `VARIANT_THEME`.
- Currency is always formatted with `Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })`. The number-field display uses a sibling formatter without the `style: "currency"` so the prefix `$` stays inside the input chrome (don't refactor those into one shared formatter — they have different output forms).
- Chart horizon: `computeChartHorizon(inputs)` returns `max(targetRetirementAge - currentAge, 30)`.
- Reference-line labels stay inside the plot area via `REFERENCE_LABEL_POSITION` (regression-tested).
- Per-variant chart visibility is **view preference, not scenario state** — must not be serialized into URL or comparison overlays.
- `<NumberField />` is a draft-aware text input. Don't revert to `type="number"` — that's what allowed the leading-zero bug. The draft state and `formatNumberDisplay` / `sanitizeNumberInput` helpers are pinned by tests.

## Tooling notes

Use Node 20:

```sh
NODE20=$(npx --yes node@20 -p "process.execPath")
export PATH="$(dirname "$NODE20"):$PATH"
```

- `gh` CLI is installed and authenticated.
- Local dev verification: `npm run dev -- --port 3308 --hostname 127.0.0.1`. `/plan` hydrates from query strings (`?currentAge=45&safeWithdrawalRate=0.035` works), updates the URL on input change, and the Copy-URL button shows the "Copied!" flash on click.

## Testing notes

- `src/lib/calc` coverage was brought above the required threshold during B8.
- TSX component tests run under Vitest via `@vitejs/plugin-react`. React Testing Library + jsdom works.
- For Recharts tests, mock `ResponsiveContainer` with a sized div. Recharts does **not** reliably render `<ReferenceLine>` label text as DOM-visible `<text>` in jsdom — prefer asserting on state-bound attributes (`data-active` on the legend `<li>`) over counting SVG labels.
- For `<ScenarioUrlSync />` tests, `vi.useFakeTimers()` is required because the URL update is debounced. Use `window.history.replaceState` to seed the URL before mount.
- Last local verification (after the formatting fix):
  - `npx vitest run` — 21 files / 94 tests passing
  - `npm run typecheck`
  - `npm run build` — `/` 161 kB, `/plan` 280 kB
  - `npm run lint`
  - Manual dev-server smoke: input fields show "150,000" / "30,000"; typing "045" then blurring shows "45"; URL updates with debounce on input change.
- Vitest coverage config still only tracks `src/lib/calc/**`.

## Files to inspect before starting D2

- [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1)
- [PRD.md](/Users/dhavalpatel/projects/FIRE-Calculators/PRD.md:1) §4.2 (side-by-side scenario comparison)
- [src/lib/url/scenario.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/url/scenario.ts:1) — encode/decode for storing comparison scenarios
- [src/lib/calc/index.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/calc/index.ts:1) — `computeAllVariants`, `projectPortfolio`
- [src/components/plan/growth-chart.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/plan/growth-chart.tsx:1) — chart pattern; D2 likely needs an n-series variant
- [src/components/plan/variant-theme.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/plan/variant-theme.ts:1) — palette (only 5 variant colors; need a separate scenario palette for up to 3 overlaid scenarios)

## D2 restart brief

Implement exactly:

`feat(compare): /plan/compare side-by-side scenario overlay`

Per PRD §4.2: "save up to 3 scenarios and overlay their trajectories on one chart."

Expected deliverables:

- A `/plan/compare` route at `src/app/plan/compare/page.tsx` (server shell, mounts a client `<CompareView />`).
- Comparison state model:
  - At most 3 scenarios. Each scenario has a label (auto: "Scenario 1/2/3"), an overlay color (introduce a `SCENARIO_PALETTE` distinct from `VARIANT_THEME`), and a `FireInputs` payload.
  - Encode/decode through a new helper that wraps `encodeScenario` per slot (e.g. `?s1.currentAge=...&s2.currentAge=...`). Round-trip tested.
  - State layer: either a small dedicated Zustand store for compare, or a local-state `useReducer` inside `<CompareView />`. Pick local-reducer if it stays under ~100 lines, otherwise hoist to a store.
- UI:
  - "Add scenario from /plan" entry: clicking the existing planner's compare CTA seeds the first scenario from `useScenarioStore.inputs`.
  - For each saved scenario: a compact summary card (current age, contribution, SWR, target Traditional FIRE) and a Remove button.
  - One overlaid `AreaChart` with one Area per scenario (color from `SCENARIO_PALETTE`). Reuse `projectPortfolio` per scenario; aligning x-axis on `age` is fine (mismatched currentAges shift the curve start — that's expected).
  - "Clone current planner" button to add another scenario seeded from the live planner.
- Tests:
  - Compare-URL encoder/decoder round trip with three scenarios.
  - Adding/removing scenarios updates state correctly and is capped at 3.
  - Each scenario card surfaces its labelled testid (e.g. `compare-scenario-card-1`).

Out of scope for D2:

- Authoring scenarios from scratch on `/plan/compare` — the only path to add a scenario is "clone current planner" (push to /plan, edit, send back). Free-form editing per slot can land in a follow-up.
- MDX `/learn` content — E1.

## Working tree notes

Tracked files are clean at the stop point.

Pre-existing untracked files to leave alone unless explicitly asked:

- `FIRE-PRD.html`
- `docs/wireframes.html`
