# Claude Handoff

Last updated: 2026-04-22
Current stop point on `main`: `65fb482`

## Read this first on resume

1. Read this file.
2. Read [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1).
3. Re-read the v1-authoritative parts of [PRD.md](/Users/dhavalpatel/projects/FIRE-Calculators/PRD.md:1):
   - §4.2 interactive growth chart
   - §5 shared `FireInputs` contract
   - §10 v1 scope
4. Re-read [docs/formulas.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/formulas.md:1) before changing calc logic.

At the end of each session for this project, replace this file with a fresh handoff that matches the latest pushed commit and next unchecked work-plan item.

## Current state

- Foundation is complete through A3.
- Calc core is complete through B8.
- Planner UI is through C3: `/plan` renders the wired input panel and the five FIRE result cards.
- The next required product commit is **C4**:
  `feat(ui): portfolio growth chart`
- Do not start C5 until C4 is committed, pushed, and CI is green.

Current checked items live in [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1):

- A1-A3: complete
- B1-B8: complete
- C1-C3: complete
- C4-F5: not started

## Latest pushed commits

- `a9f98a9` `feat(ui): /plan page skeleton + Zustand store`
- `4aea0ce` `feat(ui): input panel component wired to store`
- `65fb482` `feat(ui): result cards (5 calculator variants)`

Latest confirmed green GitHub Actions runs:

- B8: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24759041195`
- C1: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24780716699`
- C2: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24781230713`
- C3: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24781763521`

## What already exists

- Next.js 15 App Router scaffold with Tailwind and shadcn/ui primitives.
- Vitest (with `@vitejs/plugin-react` for TSX tests), Playwright, and GitHub Actions workflow.
- Pure calc module under [src/lib/calc](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/calc:1):
  - shared types/defaults/SWR presets, solver, Traditional/Coast/Barista/Lean/Fat variants, projection, scenario aggregator, reference scenarios.
  - `computeAllVariants(inputs)` returns `Record<FireVariant, FireResult>` — used by `<ResultCards />` and should be reused by C4.
  - `projectPortfolio(...)` is the function C4 will use to produce the chart series (see [src/lib/calc/projection.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/calc/projection.ts:1) for its exact signature).
- Zustand scenario store at [src/store/scenario.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/store/scenario.ts:1): `inputs` seeded from `DEFAULT_INPUTS`, `setInput(key, value)`, `resetInputs()`.
- `/plan` page at [src/app/plan/page.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/app/plan/page.tsx:1):
  - Server shell with `plan-page`, `plan-inputs`, `plan-results`, `plan-chart` data-testids.
  - Inputs section renders `<InputPanel />`; results section renders `<ResultCards />`; `plan-chart` is still a placeholder.
- `<InputPanel />` at [src/components/plan/input-panel.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/plan/input-panel.tsx:1): Personal/Financial/Assumptions/Advanced groups, percent sliders, Reset button.
- `<ResultCards />` at [src/components/plan/result-cards.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/plan/result-cards.tsx:1): five-card grid in canonical variant order with target/timeline/tagline + `Already FI` branch.
- `VARIANT_ORDER` and `VARIANT_THEME` exported from [src/components/plan/variant-theme.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/plan/variant-theme.ts:1) — this is the shared color/copy module. **C4 must import `accentHex` from here** (do not duplicate the palette). Values are Traditional `#f97316`, Coast `#3b82f6`, Barista `#a855f7`, Lean `#10b981`, Fat `#f59e0b`.
- TSX tests pattern: React Testing Library + jsdom. For store mutations inside a rendered test, wrap the `useScenarioStore.getState().setInput(...)` call in `act()`.

The home page (`/`) is still the placeholder landing page — it gets rebuilt in C5.

## Important decisions already made

### Formula authority

Use `PRD.md` + `docs/formulas.md` as the source of truth for math.

The prompt's scenario year labels conflict with the project's own formulas in multiple cases. The user explicitly approved following the documented formulas instead of the conflicting prompt-year estimates.

Implications:

- Keep prompt target values where they match.
- Keep formula-driven year expectations where the prompt conflicts.
- Coast and Barista were cross-checked during implementation against WalletBurst, but tests remain formula-driven.

### Readability preference

The user explicitly asked for human-readable variable names, including in tests, and for concise documentation comments where logic is non-obvious.

Preserve that style:

- prefer `currentInvested`, `annualContribution`, `expectedRealReturn`
- avoid introducing terse local names in new code/tests unless required by a fixed external API
- keep comments short and high-signal

### Commit discipline

- Follow the prescribed sequence in `docs/work-plan.md`.
- Update the matching checkbox in the same commit that implements that item.
- Wait for CI to go green before starting the next unchecked item.
- No scope drift into v2/v3.

### UI decisions locked in by C1-C3

- State library: **Zustand** via `useScenarioStore`. URL-param sync is a D1 concern — not C4.
- Default scenario shape is `DEFAULT_INPUTS`; do not redefine defaults elsewhere.
- Page shell (`/plan/page.tsx`) stays a server component. Client-only pieces (anything subscribing to the store or using Recharts) live in `src/components/plan/*` with `"use client"` at the top.
- Slider primitive (`@base-ui/react`) renders one thumb per item in the `value` array — always pass `value={[x]}`.
- Empty text in a numeric input is normalized to `0` in the store.
- **Variant colors come from `VARIANT_THEME`**, always. This is the single source of truth for the chart legend and card accents.
- Currency formatting uses `Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })` in result cards. Reuse the same formatter style in chart tooltips.

## Tooling notes

The machine default Node is too old for the current stack. Use Node 20 for app and npm commands:

```sh
NODE20=$(npx --yes node@20 -p "process.execPath")
export PATH="$(dirname "$NODE20"):$PATH"
```

Other environment notes:

- `create-next-app@latest` now scaffolds Next 16 and refused this non-empty repo. A1 used `create-next-app@15.5.15` in a temp dir and merged the scaffold in.
- `gh` CLI is installed and authenticated for checking Actions runs.
- Local dev verification: `npm run dev -- --port 3301 --hostname 127.0.0.1`, then `curl http://127.0.0.1:3301/plan`. Input panel + five result cards render with default values (Traditional $1,000,000, Coast $93,663, Barista $500,000, Lean $875,000, Fat $3,750,000).
- `recharts` is already in `dependencies` (installed in A3) — do not install anything new for C4.

## Testing notes

- `src/lib/calc` coverage was brought above the required threshold during B8.
- TSX component tests run under Vitest via `@vitejs/plugin-react`. React Testing Library + jsdom works. When asserting the effect of direct `useScenarioStore.getState().setInput(...)` calls from inside a test where a component is rendered, wrap them in `act()` to avoid React 19 act warnings.
- Last local C3 verification:
  - `npx vitest run` — 15 files / 49 tests passing
  - `npm run typecheck`
  - `npm run build` — `/plan` is now 18.8 kB First Load JS (+1.5 kB vs C2)
  - `npm run lint`
  - Manual dev-server smoke: result cards render with correct formatted targets and variant color accents.
- Vitest coverage config still only tracks `src/lib/calc/**` — component tests don't contribute toward the calc coverage threshold.

## Files to inspect before starting C4

- [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1)
- [PRD.md](/Users/dhavalpatel/projects/FIRE-Calculators/PRD.md:1) §4.2 interactive growth chart
- [docs/wireframes.html](/Users/dhavalpatel/projects/FIRE-Calculators/docs/wireframes.html:1727) chart container + legend
- [src/lib/calc/projection.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/calc/projection.ts:1) — confirm signature and return shape
- [src/lib/calc/__tests__/projection.test.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/calc/__tests__/projection.test.ts:1) — sample expected output
- [src/components/plan/result-cards.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/plan/result-cards.tsx:1) — mirror the subscribe-and-memoize pattern
- [src/components/plan/variant-theme.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/plan/variant-theme.ts:1) — palette source of truth

## C4 restart brief

Implement exactly:

`feat(ui): portfolio growth chart`

Expected deliverables:

- A `<GrowthChart />` client component (likely `src/components/plan/growth-chart.tsx`) that:
  - subscribes to `useScenarioStore((state) => state.inputs)`
  - builds the chart series from `projectPortfolio(...)` (retirement-age horizon; extend modestly if the PRD wireframe suggests a longer window)
  - renders a Recharts `AreaChart` (or `LineChart`) of portfolio value over time
  - overlays the five FIRE targets as horizontal reference lines using `accentHex` from `VARIANT_THEME`
  - uses a currency-formatted tooltip (match the result-cards formatter style)
  - exposes `data-testid="growth-chart"` on the chart root and a stable legend testid (e.g. `growth-chart-legend`)
  - handles the edge case where `yearsToReach = 0` / already FI (still renders a flat line rather than crashing)
- Swap the `plan-chart` placeholder in `/plan/page.tsx` for `<GrowthChart />`. Keep the section's `plan-chart` data-testid on the wrapper.
- Tests (Vitest + RTL):
  - Renders for `DEFAULT_INPUTS` without crashing and produces a non-empty series (assert on the chart root testid + presence of at least one reference line)
  - Updating the store (e.g. change `expectedRealReturn`) changes the rendered series — probe via snapshot length or a data attribute you expose
  - Already-FI case still renders (set `currentInvested` ≥ Traditional target)
  - Because Recharts uses a `ResponsiveContainer` that needs a non-zero parent size in jsdom, render a fixed-width wrapper in tests (mock `ResponsiveContainer` or wrap it in a sized div). See the Recharts testing guide if you hit this.

Out of scope for C4:

- Scenario comparison overlay — D2.
- Landing page rebuild / header/footer — C5.
- URL sync / share button — D1.

## Working tree notes

Tracked files are clean at the stop point.

Pre-existing untracked files to leave alone unless explicitly asked:

- `FIRE-PRD.html`
- `docs/wireframes.html`
