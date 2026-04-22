# Claude Handoff

Last updated: 2026-04-21

## Current status

The repo is on `main` at commit `cbec5b8` and the first three required commits are complete:

- `155b841` `chore: scaffold Next.js 15 + TypeScript + Tailwind`
- `aa10170` `chore: configure Vitest + Playwright + CI`
- `cbec5b8` `chore: install shadcn/ui, Recharts, Zustand`

GitHub Actions is green for the latest foundation commit:

- A2: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24756755148`
- A3: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24756947454`

## Next required step

Resume at **B1** with this exact commit:

`feat(calc): add FireInputs type, defaults, and SWR presets`

Planned files for B1:

- `src/lib/calc/types.ts`
- `src/lib/calc/defaults.ts`
- `src/lib/calc/swr-presets.ts`
- tests under `src/lib/calc/__tests__/`

Scope for B1:

- Add `FireInputs` exactly per PRD §5. No v2/v3 fields.
- Add `FireResult = { target, yearsToReach, alreadyReached, variant }`.
- Add `DEFAULT_INPUTS`.
- Add the 7-row SWR table from PRD §6.6.
- Keep `src/lib/calc/` pure TypeScript only.

## Important constraints to preserve

- Follow the prescribed commit order. After B1, continue to B2.
- `src/lib/calc/` must stay pure and framework-free.
- No Monte Carlo. Leave `src/lib/simulation/` empty.
- Run `npx vitest run` before each code-carrying commit.
- Keep `main` buildable and green before pushing.

## Tooling notes

- The machine default Node is too old for the current stack. Use Node 20 for app and npm commands:

```sh
NODE20=$(npx --yes node@20 -p "process.execPath")
export PATH="$(dirname "$NODE20"):$PATH"
```

- `create-next-app@latest` now scaffolds Next 16 and refused this non-empty repo. The repo was scaffolded from `create-next-app@15.5.15` in a temp dir and then merged in.
- The current `shadcn` CLI defaults to a neutral preset. The project still uses the official CLI-generated files, but [components.json](/Users/dhavalpatel/projects/FIRE-Calculators/components.json) and [src/app/globals.css](/Users/dhavalpatel/projects/FIRE-Calculators/src/app/globals.css) were adjusted to the requested slate base color.
- Vitest, Playwright, and GitHub Actions are configured in:
  - [vitest.config.ts](/Users/dhavalpatel/projects/FIRE-Calculators/vitest.config.ts)
  - [playwright.config.ts](/Users/dhavalpatel/projects/FIRE-Calculators/playwright.config.ts)
  - [.github/workflows/test.yml](/Users/dhavalpatel/projects/FIRE-Calculators/.github/workflows/test.yml)

## Testing notes

- Current passing tests:
  - [tests/scaffold.test.ts](/Users/dhavalpatel/projects/FIRE-Calculators/tests/scaffold.test.ts)
  - [src/lib/utils.test.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/lib/utils.test.ts)
- Avoid adding TSX-based Vitest component tests until the JSX handling is tuned for this setup. Pure TS tests are working cleanly now.

## Working tree notes

- Ignore these pre-existing untracked files unless explicitly asked to use them:
  - `FIRE-PRD.html`
  - `docs/wireframes.html`
