# Claude Handoff

Last updated: 2026-04-21
Current stop point on `main`: `687010f`

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
- The work-plan tracker was added after B8 and is the current stop-point.
- The next required product commit is **C1**:
  `feat(ui): /plan page skeleton + Zustand store`
- Do not start C2 until C1 is committed, pushed, and CI is green.

Current checked items live in [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1):

- A1-A3: complete
- B1-B8: complete
- C1-F5: not started

## Latest pushed commits

- `54378c1` `feat(calc): scenario aggregator + reference scenarios test suite`
- `687010f` `docs: add implementation work plan tracker`

Latest confirmed green GitHub Actions runs:

- B8: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24759041195`
- work-plan docs checkpoint: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24759133313`

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

The app still only renders the placeholder landing page. `/plan` has not been started.

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

## Tooling notes

The machine default Node is too old for the current stack. Use Node 20 for app and npm commands:

```sh
NODE20=$(npx --yes node@20 -p "process.execPath")
export PATH="$(dirname "$NODE20"):$PATH"
```

Other environment notes:

- `create-next-app@latest` now scaffolds Next 16 and refused this non-empty repo. A1 used `create-next-app@15.5.15` in a temp dir and merged the scaffold in.
- `gh` CLI is installed and authenticated for checking Actions runs.
- A local dev server was previously verified at `http://127.0.0.1:3000`, but only the placeholder home page exists right now.

## Testing notes

- `src/lib/calc` coverage was brought above the required threshold during B8.
- The last local B8 verification included:
  - `npx vitest run`
  - `npm run typecheck`
  - `npm run build`
  - `npm run lint`
  - `npx vitest run --coverage`
- Vitest TSX component testing was intentionally avoided so far because the current setup is clean for pure TS tests but not yet tuned for TSX imports under Vitest.

## Files to inspect before starting C1

- [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1)
- [PRD.md](/Users/dhavalpatel/projects/FIRE-Calculators/PRD.md:1)
- [docs/wireframes.html](/Users/dhavalpatel/projects/FIRE-Calculators/docs/wireframes.html:1577)
- [src/lib/calc/index.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/calc/index.ts:1)
- [src/lib/calc/types.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/calc/types.ts:1)
- [src/lib/calc/defaults.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/calc/defaults.ts:1)

## C1 restart brief

Implement exactly:

`feat(ui): /plan page skeleton + Zustand store`

Expected deliverables:

- `src/store/scenario.ts`
  - store `FireInputs`
  - expose `setInput`
  - expose `resetInputs`
- `src/app/plan/page.tsx`
  - planner shell only
  - inputs/results/chart placeholders
  - `data-testid` markers on each section for future e2e work
- tests for the new store

Keep C1 intentionally skeletal. Do not pull C2 or C3 work into it.

## Working tree notes

Tracked files are clean at the stop point.

Pre-existing untracked files to leave alone unless explicitly asked:

- `FIRE-PRD.html`
- `docs/wireframes.html`
