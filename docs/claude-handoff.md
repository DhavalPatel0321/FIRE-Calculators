# Claude Handoff

Last updated: 2026-04-22
Current stop point on `main`: `a9f98a9`

## Read this first on resume

1. Read this file.
2. Read [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1).
3. Re-read the v1-authoritative parts of [PRD.md](/Users/dhavalpatel/projects/FIRE-Calculators/PRD.md:1):
   - §1 v1 column in the feature matrix
   - §5 shared `FireInputs` contract
   - §10 v1 scope
4. Re-read [docs/formulas.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/formulas.md:1) before changing calc logic.

At the end of each session for this project, replace this file with a fresh handoff that matches the latest pushed commit and next unchecked work-plan item.

## Current state

- Foundation is complete through A3.
- Calc core is complete through B8.
- Planner UI is started: C1 is done (skeleton page + Zustand store).
- The next required product commit is **C2**:
  `feat(ui): input panel component wired to store`
- Do not start C3 until C2 is committed, pushed, and CI is green.

Current checked items live in [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1):

- A1-A3: complete
- B1-B8: complete
- C1: complete
- C2-F5: not started

## Latest pushed commits

- `687010f` `docs: add implementation work plan tracker`
- `7ddc446` `docs: refresh claude handoff`
- `a9f98a9` `feat(ui): /plan page skeleton + Zustand store`

Latest confirmed green GitHub Actions runs:

- B8: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24759041195`
- work-plan docs checkpoint: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24759133313`
- C1: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24780716699`

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
- Zustand scenario store at [src/store/scenario.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/store/scenario.ts:1)
  - `inputs` seeded from `DEFAULT_INPUTS`
  - `setInput(key, value)` — generic, type-safe per `FireInputs` key
  - `resetInputs()` — restores `DEFAULT_INPUTS`
- `/plan` skeleton at [src/app/plan/page.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/app/plan/page.tsx:1)
  - Server component shell, no store consumption yet
  - `data-testid` markers: `plan-page`, `plan-inputs`, `plan-results`, `plan-chart`
  - Placeholder copy calls out which slot (C2/C3/C4) wires each section
- Store tests at [src/store/__tests__/scenario.test.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/store/__tests__/scenario.test.ts:1) — 6 tests cover defaults, setInput, resetInputs, and referential-safety

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

### UI decisions locked in by C1

- State library: **Zustand** (via `useScenarioStore`). URL-param sync is a D1 concern — do not introduce it in C2-C5.
- Default scenario shape is whatever `DEFAULT_INPUTS` says; do not redefine defaults in the store.
- The `/plan` page is currently a server component with no `"use client"` directive. C2 will need to extract the input panel into a client component that subscribes to `useScenarioStore`, while keeping the page shell itself server-rendered if possible.

## Tooling notes

The machine default Node is too old for the current stack. Use Node 20 for app and npm commands:

```sh
NODE20=$(npx --yes node@20 -p "process.execPath")
export PATH="$(dirname "$NODE20"):$PATH"
```

Other environment notes:

- `create-next-app@latest` now scaffolds Next 16 and refused this non-empty repo. A1 used `create-next-app@15.5.15` in a temp dir and merged the scaffold in.
- `gh` CLI is installed and authenticated for checking Actions runs.
- A local dev server was previously verified at `http://127.0.0.1:3000`. `/plan` now renders the skeleton with the three labeled sections.

## Testing notes

- `src/lib/calc` coverage was brought above the required threshold during B8.
- The last local C1 verification included:
  - `npx vitest run` — 13 files / 41 tests passing (includes the 6 new scenario store tests)
  - `npm run typecheck`
  - `npm run build` — `/plan` is listed as a static route
  - `npm run lint`
- Vitest TSX component testing is still intentionally avoided — the setup is clean for pure TS tests, not yet tuned for TSX imports under Vitest. When C2 introduces client components, decide whether to test them via Playwright (using the existing `data-testid` markers) or invest in a TSX-ready Vitest config.

## Files to inspect before starting C2

- [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1)
- [PRD.md](/Users/dhavalpatel/projects/FIRE-Calculators/PRD.md:1) §5 input contract, §6 SWR range
- [docs/wireframes.html](/Users/dhavalpatel/projects/FIRE-Calculators/docs/wireframes.html:1591) input panel section
- [src/store/scenario.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/store/scenario.ts:1)
- [src/app/plan/page.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/app/plan/page.tsx:1)
- [src/components/ui](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/ui:1) (existing shadcn primitives: button, card, input, label, slider, tabs, tooltip)

## C2 restart brief

Implement exactly:

`feat(ui): input panel component wired to store`

Expected deliverables:

- A client input-panel component (likely `src/components/plan/input-panel.tsx` or similar) that:
  - reads every `FireInputs` field from `useScenarioStore`
  - updates the store via `setInput` on change
  - groups fields the way the wireframe does: Personal, Financial, Assumptions (return + SWR sliders)
  - uses the existing shadcn primitives (Input/Label/Slider/Tooltip) so styling stays consistent
  - keeps labels and ids human-readable (`currentInvested` etc.)
  - exposes a Reset button that calls `resetInputs`
- `/plan/page.tsx` swaps the `plan-inputs` placeholder for the new component. Keep the existing `data-testid` markers on the section wrapper so future Playwright tests still hit stable selectors.
- Tests: at minimum a store-level test proving the input panel’s change flow updates state (if TSX testing is deferred, document why in the commit). Playwright is acceptable if you prefer to leave Vitest TSX setup for later.

Out of scope for C2 (belongs to C3-C5 or D1):

- Result cards — the `plan-results` section stays as a placeholder.
- Growth chart — the `plan-chart` section stays as a placeholder.
- URL sync / share button — D1.
- Landing page rebuild — C5.

## Working tree notes

Tracked files are clean at the stop point.

Pre-existing untracked files to leave alone unless explicitly asked:

- `FIRE-PRD.html`
- `docs/wireframes.html`
