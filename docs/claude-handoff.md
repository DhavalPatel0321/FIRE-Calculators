# Claude Handoff

Last updated: 2026-04-22
Current stop point on `main`: `49a4ce6`

## Read this first on resume

1. Read this file.
2. Read [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1).
3. Re-read the v1-authoritative parts of [PRD.md](/Users/dhavalpatel/projects/FIRE-Calculators/PRD.md:1):
   - §4.2 v1 features (URL-shareable scenarios + side-by-side comparison)
   - §5 shared `FireInputs` contract (source of truth for serialized fields)
   - §10 v1 scope

At the end of each session for this project, replace this file with a fresh handoff that matches the latest pushed commit and next unchecked work-plan item.

## Current state

- Track A (Foundation), Track B (Calc core), and Track C (Planner UI) are complete.
- `/` landing, `/plan` planner (inputs + result cards + growth chart with toggleable reference lines), shared site header/footer are all wired.
- Two polish commits landed after C5: the growth-chart reference-line labels no longer clip outside the SVG (`0df9aa4`), and each variant's reference line is now individually toggleable from the legend checkboxes (`49a4ce6`).
- The next required product commit is **D1**:
  `feat(url): URL-encoded scenario state + share button`
- Do not start D2 until D1 is committed, pushed, and CI is green.

Current checked items live in [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1):

- A1-A3: complete
- B1-B8: complete
- C1-C5: complete
- D1-F5: not started

## Latest pushed commits

- `79f4075` `feat(ui): landing page + header/footer`
- `0df9aa4` `fix(chart): anchor reference-line labels inside the plot area`
- `49a4ce6` `feat(chart): toggleable reference lines per variant`

Latest confirmed green GitHub Actions runs:

- B8: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24759041195`
- C1: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24780716699`
- C2: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24781230713`
- C3: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24781763521`
- C4: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24795521643`
- C5: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24796024000`
- chart label fix: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24796379218`
- chart variant toggles: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24796513693`

## What already exists

- Next.js 15 App Router + Tailwind + shadcn/ui. Fonts via `next/font`.
- Vitest (with `@vitejs/plugin-react` for TSX tests), Playwright, GitHub Actions workflow.
- Pure calc module under [src/lib/calc](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/calc:1):
  - types, defaults, SWR presets, solver, all variants, projection, scenario aggregator, reference scenarios.
  - Entry points the UI uses: `computeAllVariants(inputs)` and `projectPortfolio(inputs, years)`.
- Zustand scenario store at [src/store/scenario.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/store/scenario.ts:1): `inputs` (from `DEFAULT_INPUTS`), `setInput(key, value)`, `resetInputs()`.
- Routes:
  - `/` — landing page at [src/app/page.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/app/page.tsx:1) (hero + five-variant strip + v1 features + CTA).
  - `/plan` — planner at [src/app/plan/page.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/app/plan/page.tsx:1) with `InputPanel`, `ResultCards`, `GrowthChart`.
  - `/learn` — does not exist yet; header and landing link to it anyway (E1 will create it).
- Site chrome at [src/components/site](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/site:1):
  - `SiteHeader` (brand, Home/Plan/Learn nav, Start-planning CTA)
  - `SiteFooter` (copyright, non-advice disclaimer, GitHub link)
  - Mounted in [src/app/layout.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/app/layout.tsx:1) so every route inherits them.
- Planner components at [src/components/plan](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/plan:1):
  - `InputPanel` — Personal/Financial/Assumptions/Advanced groups, percent sliders, Reset.
  - `ResultCards` — canonical-order five-card grid, "Already FI" branch.
  - `GrowthChart` — Recharts `AreaChart` over `computeChartHorizon()` horizon, five dashed `ReferenceLine`s whose labels anchor to `REFERENCE_LABEL_POSITION` (`"insideTopRight"`) and are individually toggleable from the legend (local `useState<Record<FireVariant, boolean>>`, default all on).
  - `variant-theme.ts` — `VARIANT_ORDER`, `VARIANT_THEME` (accent hex + classes + tagline).
- TSX test pattern: React Testing Library + jsdom. Wrap direct `useScenarioStore.getState().setInput(...)` calls made while a component is rendered in `act()`. For Recharts tests, mock `ResponsiveContainer` with a sized div (see `growth-chart.test.tsx`).

Stable data-testids you can rely on for D1/D2/F4:

- Layout: `site-header`, `site-header-brand`, `site-header-nav-home|plan|learn`, `site-header-cta`, `site-footer`, `site-footer-repo`.
- Landing: `landing-page`, `landing-headline`, `landing-cta-primary`, `landing-cta-secondary`, `landing-cta-footer`, `landing-variants`, `landing-variant-<variant>`.
- Planner:
  - shell: `plan-page`, `plan-inputs`, `plan-results`, `plan-chart`
  - inputs: per-field `input-<field>`, `slider-<field>`, `slider-value-<field>`, `reset-inputs`
  - results: `result-cards-grid`, `result-card-<variant>`, `result-number-<variant>`, `result-timeline-<variant>`
  - chart: `growth-chart`, `growth-chart-legend`, `growth-chart-legend-<variant>` (carries `data-active="true"|"false"`), `growth-chart-toggle-<variant>`, `growth-chart-end-balance`

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
- Interleaving a targeted `fix(...)` or small `feat(...)` commit between work-plan items is fine when the user explicitly asks for it — it doesn't need its own checkbox but must not block the next queued item.

### UI / state decisions locked in by C1-C5 and chart polish commits

- State library: **Zustand** via `useScenarioStore`. D1 is where URL sync lands — plan is one-way sync from store → URL on change, with an initial read from URL → store on mount of `/plan`.
- Default scenario shape is `DEFAULT_INPUTS`.
- Page shells stay server components. Client-only pieces live in `src/components/**` with `"use client"`.
- Variant colors come from `VARIANT_THEME`.
- Currency is always formatted with `Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })` (compact variant in chart Y axis).
- Chart horizon: `computeChartHorizon(inputs)` returns `max(targetRetirementAge - currentAge, 30)`.
- Reference-line labels must stay inside the plot area via `REFERENCE_LABEL_POSITION` (a regression test locks this to an `inside*` variant — don't weaken it).
- The per-variant reference-line visibility is a **view preference**, not scenario state. It lives in local component state and must **not** be serialized into the URL (D1) or the comparison overlay (D2).

## Tooling notes

Use Node 20:

```sh
NODE20=$(npx --yes node@20 -p "process.execPath")
export PATH="$(dirname "$NODE20"):$PATH"
```

- `gh` CLI is installed and authenticated.
- Local dev verification: `npm run dev -- --port 3304 --hostname 127.0.0.1`. Both `/` and `/plan` render the shared chrome; `/` shows hero + variant strip; `/plan` shows the full three-panel planner with working variant toggles in the chart legend.

## Testing notes

- `src/lib/calc` coverage was brought above the required threshold during B8.
- TSX component tests run under Vitest via `@vitejs/plugin-react`. React Testing Library + jsdom works.
- For Recharts tests, mock `ResponsiveContainer` with a sized div because jsdom has zero layout. Recharts does **not** reliably render `<ReferenceLine>` label text as DOM-visible `<text>` in jsdom — prefer asserting on state-bound attributes (e.g., `data-active` on the legend `<li>`) rather than counting rendered SVG labels.
- Last local verification (after the chart polish commits):
  - `npx vitest run` — 18 files / 67 tests passing
  - `npm run typecheck`
  - `npm run build` — `/` 161 kB, `/plan` 280 kB (Recharts)
  - `npm run lint`
  - Manual dev-server smoke on `/` and `/plan`: chrome + content render cleanly; variant toggles flip lines on/off.
- Vitest coverage config still only tracks `src/lib/calc/**`.

## Files to inspect before starting D1

- [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1)
- [PRD.md](/Users/dhavalpatel/projects/FIRE-Calculators/PRD.md:1) §4.2 (URL-shareable scenarios), §5 (FireInputs)
- [src/lib/calc/types.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/calc/types.ts:1) — serialization contract is this `FireInputs` shape
- [src/lib/calc/defaults.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/calc/defaults.ts:1) — omit-when-equal-default strategy works well here
- [src/store/scenario.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/store/scenario.ts:1) — D1 will bolt a URL-sync effect on top of this
- [src/app/plan/page.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/app/plan/page.tsx:1) — server shell; the sync/read must live in a client component that mounts inside
- [src/components/plan/input-panel.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/plan/input-panel.tsx:1) — natural home for the Copy-URL button (next to Reset)

## D1 restart brief

Implement exactly:

`feat(url): URL-encoded scenario state + share button`

Expected deliverables:

- A small serialization module (e.g. `src/lib/url/scenario.ts`) with:
  - `encodeScenario(inputs: FireInputs): URLSearchParams` — omit fields equal to `DEFAULT_INPUTS` so shared URLs stay short.
  - `decodeScenario(params: URLSearchParams): Partial<FireInputs>` — coerce numerics, drop unknown keys, drop NaN/non-finite values.
  - Unit tests: round-trip a realistic scenario, missing-params yields `{}`, invalid numerics are dropped, defaults-only input produces an empty `URLSearchParams`.
- A client-only `<ScenarioUrlSync />` component (e.g. `src/components/plan/scenario-url-sync.tsx`) that:
  - On mount, reads `window.location.search`, decodes, and applies via `setInput` per field (or a new `applyInputs(partial)` store action — add it if needed).
  - Subscribes to store changes and pushes a new URL via `history.replaceState` (not Next router `push`); debounce ~150 ms.
  - Guards against SSR (`typeof window !== "undefined"`).
  - Mount inside `src/app/plan/page.tsx` (no visible output).
- A "Copy shareable URL" button. Keep it inside the input panel's action area (next to Reset). Uses `navigator.clipboard.writeText(window.location.href)` and flashes a "Copied" state for ~1.5 s.
- Do **not** encode the chart's per-variant visibility toggles — those are view preferences, not scenario state.
- Tests:
  - Serialization module tests (pure functions, no DOM).
  - Sync component: mounts, decodes `?currentAge=45`, store reflects the change; after a `setInput` the URL gets updated (mock `history.replaceState`).
  - Button: clicking invokes `navigator.clipboard.writeText` with the current `window.location.href` (mock both).

Out of scope for D1:

- `/plan/compare` multi-scenario overlay — D2.
- Any SSR pre-hydration of the scenario from search params. Initial server render uses `DEFAULT_INPUTS`; the URL hydrates on the client.
- New URL shortener, base64 compaction, or gzip — plain `URLSearchParams` is sufficient for v1 given defaults are omitted.

## Working tree notes

Tracked files are clean at the stop point.

Pre-existing untracked files to leave alone unless explicitly asked:

- `FIRE-PRD.html`
- `docs/wireframes.html`
