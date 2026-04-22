# Claude Handoff

Last updated: 2026-04-22
Current stop point on `main`: `4aea0ce`

## Read this first on resume

1. Read this file.
2. Read [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1).
3. Re-read the v1-authoritative parts of [PRD.md](/Users/dhavalpatel/projects/FIRE-Calculators/PRD.md:1):
   - §1 v1 column in the feature matrix
   - §4 v1 scope and v1 features
   - §5 shared `FireInputs` contract
   - §6 formulas (if touching math)
4. Re-read [docs/formulas.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/formulas.md:1) before changing calc logic.

At the end of each session for this project, replace this file with a fresh handoff that matches the latest pushed commit and next unchecked work-plan item.

## Current state

- Foundation is complete through A3.
- Calc core is complete through B8.
- Planner UI is through C2: input panel is wired to the store on `/plan`.
- The next required product commit is **C3**:
  `feat(ui): result cards (5 calculator variants)`
- Do not start C4 until C3 is committed, pushed, and CI is green.

Current checked items live in [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1):

- A1-A3: complete
- B1-B8: complete
- C1-C2: complete
- C3-F5: not started

## Latest pushed commits

- `753bd1e` `docs: refresh claude handoff for C2`
- `a9f98a9` `feat(ui): /plan page skeleton + Zustand store`
- `4aea0ce` `feat(ui): input panel component wired to store`

Latest confirmed green GitHub Actions runs:

- B8: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24759041195`
- C1: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24780716699`
- C2: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24781230713`

## What already exists

- Next.js 15 App Router scaffold with Tailwind and shadcn/ui primitives
- Vitest, Playwright, and GitHub Actions workflow
- Pure calc module under [src/lib/calc](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/calc:1)
  - shared types/defaults/SWR presets
  - solver
  - Traditional, Coast, Barista, Lean, Fat variants
  - projection
  - scenario aggregator
  - reference scenario coverage
  - `computeAllVariants(inputs)` is exported from [src/lib/calc/index.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/calc/index.ts:1) and returns `Record<FireVariant, FireResult>` — use this in C3 rather than wiring each variant function separately.
- Zustand scenario store at [src/store/scenario.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/store/scenario.ts:1)
  - `inputs` seeded from `DEFAULT_INPUTS`
  - `setInput(key, value)` — generic, type-safe per `FireInputs` key
  - `resetInputs()`
- `/plan` page at [src/app/plan/page.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/app/plan/page.tsx:1)
  - Server shell with `plan-page`, `plan-inputs`, `plan-results`, `plan-chart` data-testids
  - `plan-inputs` section renders `<InputPanel />`
  - `plan-results` and `plan-chart` are still placeholder cards
- `<InputPanel />` client component at [src/components/plan/input-panel.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/plan/input-panel.tsx:1)
  - Groups: Personal (age), Financial ($), Assumptions (real return + SWR sliders), Advanced `<details>` (inflation slider + Lean/Fat expense overrides)
  - Every field emits a `data-testid` of the form `input-<field>` or `slider-<field>` plus `slider-value-<field>` for the percent read-out
  - Reset button has `data-testid="reset-inputs"` and calls `resetInputs()`
- TSX tests are now enabled via `@vitejs/plugin-react`. Coverage config is still scoped to `src/lib/calc/**`, so component tests do not count toward the calc coverage threshold.

The app home page (`/`) is still the placeholder landing page — `/` won't be rebuilt until C5.

## Important decisions already made

### Formula authority

Use `PRD.md` + `docs/formulas.md` as the source of truth for math.

The prompt’s scenario year labels conflict with the project’s own formulas in multiple cases. The user explicitly approved following the documented formulas instead of the conflicting prompt-year estimates.

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

### UI decisions locked in by C1-C2

- State library: **Zustand** (via `useScenarioStore`). URL-param sync is a D1 concern — do not introduce it in C3-C5.
- Default scenario shape is `DEFAULT_INPUTS`; do not redefine defaults elsewhere.
- Page shell (`/plan/page.tsx`) stays a server component. Client-only pieces (anything subscribing to the store) live in `src/components/plan/*` with `"use client"` at the top.
- Slider primitive from `@base-ui/react` renders as many thumbs as items in the `value` array — always pass a single-element array (`value={[x]}`) for single-thumb sliders.
- Empty text in a numeric input is normalized to `0` in the store; intentional so typing/backspacing doesn't thrash NaN through the calc.

## Tooling notes

The machine default Node is too old for the current stack. Use Node 20 for app and npm commands:

```sh
NODE20=$(npx --yes node@20 -p "process.execPath")
export PATH="$(dirname "$NODE20"):$PATH"
```

Other environment notes:

- `create-next-app@latest` now scaffolds Next 16 and refused this non-empty repo. A1 used `create-next-app@15.5.15` in a temp dir and merged the scaffold in.
- `gh` CLI is installed and authenticated for checking Actions runs.
- Local dev verification: `npm run dev -- --port 3300 --hostname 127.0.0.1`, then `curl http://127.0.0.1:3300/plan`. Input panel renders with all default values and data-testids.

## Testing notes

- `src/lib/calc` coverage was brought above the required threshold during B8.
- TSX component tests are now enabled (via `@vitejs/plugin-react`). React Testing Library + jsdom works. When asserting the effect of direct `useScenarioStore.getState().setInput(...)` calls from inside a test where a component is rendered, wrap them in `act()` to avoid React 19 act warnings.
- Last local C2 verification:
  - `npx vitest run` — 14 files / 45 tests passing
  - `npm run typecheck`
  - `npm run build` — `/plan` is now 17.3 kB First Load JS
  - `npm run lint`
  - Manual: `npm run dev -- --port 3300` and verify `/plan` renders defaults (7.0% / 4.0% / $150,000 / etc.)
- Vitest coverage still only tracks `src/lib/calc/**` — do not expect component tests to contribute toward the calc coverage threshold.

## Files to inspect before starting C3

- [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1)
- [PRD.md](/Users/dhavalpatel/projects/FIRE-Calculators/PRD.md:1) §4.2 live calculator cards, §6 formulas
- [docs/wireframes.html](/Users/dhavalpatel/projects/FIRE-Calculators/docs/wireframes.html:1672) results header + five-card grid
- [src/lib/calc/index.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/calc/index.ts:1) — especially `computeAllVariants`
- [src/lib/calc/types.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/calc/types.ts:1) — `FireResult` shape (`target`, `yearsToReach`, `alreadyReached`, `variant`)
- [src/components/plan/input-panel.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/plan/input-panel.tsx:1) — follow the same store-subscription pattern

## C3 restart brief

Implement exactly:

`feat(ui): result cards (5 calculator variants)`

Expected deliverables:

- A `<ResultCards />` client component (likely `src/components/plan/result-cards.tsx`) that:
  - subscribes to `useScenarioStore((state) => state.inputs)`
  - calls `computeAllVariants(inputs)` on every render (cheap, all variants are pure)
  - renders five cards: Traditional, Coast, Barista, Lean, Fat — in that order
  - each card shows: variant name, `$target` (formatted), `yearsToReach` (one decimal) and age-at-FI, and a short explainer line pulled from the PRD / wireframe copy
  - handles the `alreadyReached === true` case (e.g. "Already FI — congrats" or similar — do not print negative years)
  - assigns consistent variant colors that match the wireframe (Traditional orange, Coast blue, Barista purple, Lean emerald, Fat amber) — these same colors must be reused by the chart in C4
  - exposes `data-testid="result-card-<variant>"` on each card and a stable inner testid for the number (e.g. `result-number-<variant>`) so C4/F4 can assert against them
- Swap the `plan-results` placeholder in `/plan/page.tsx` for `<ResultCards />`. Keep the `plan-results` data-testid on the wrapper.
- Tests (Vitest + RTL):
  - Renders all five variant cards with correct target amounts for `DEFAULT_INPUTS`
  - Updating the store (via `setInput`) updates at least one visible card — proves subscription wiring
  - `alreadyReached` branch renders the "already FI" copy (use the scenario 6 preset from the reference-scenarios tests if useful)

Out of scope for C3 (defer):

- Portfolio growth chart — C4
- Landing page rebuild / header/footer — C5
- URL sync / share button — D1

## Working tree notes

Tracked files are clean at the stop point.

Pre-existing untracked files to leave alone unless explicitly asked:

- `FIRE-PRD.html`
- `docs/wireframes.html`
