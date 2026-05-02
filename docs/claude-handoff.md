# Claude Handoff

Last updated: 2026-05-02
Current stop point on `main`: `a441f1b` (last product commit: `e3d9acd`)

> Verified on 2026-05-02 against the current tree: HEAD is `a441f1b`, working tree clean except for the two pre-existing untracked HTML files noted at the bottom, `next.config.ts` still has no MDX wiring, and the next required product commit is **E1**. The state described below is accurate.

## Read this first on resume

1. Read this file.
2. Read [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1).
3. Re-read the v1-authoritative parts of [PRD.md](/Users/dhavalpatel/projects/FIRE-Calculators/PRD.md:1):
   - §4.2 v1 features (`/learn/*` MDX explainers)
   - §6.6 SWR explainer copy (canonical source for the SWR `/learn` page)
   - §10 v1 scope

At the end of each session for this project, replace this file with a fresh handoff that matches the latest pushed commit and next unchecked work-plan item.

## Current state

- Track A (Foundation), Track B (Calc core), Track C (Planner UI), and Track D (Persistence + Compare) are complete.
- `/plan` hydrates from URL, debounces store-driven URL updates via `history.replaceState`, has a Copy-share-URL button, formats $ amounts with comma separators, and links to `/plan/compare`.
- `/plan/compare` overlays up to 3 scenarios with their own slate/emerald/violet palette, hydrates from `?sN.*` URL params, and re-keys slots after removal.
- The next required product commit is **E1**:
  `feat(content): MDX setup + /learn layout + fire-basics`
- Do not start E2 until E1 is committed, pushed, and CI is green.

Current checked items live in [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1):

- A1-A3: complete
- B1-B8: complete
- C1-C5: complete
- D1, D2: complete
- E1-F5: not started

## Latest pushed commits

- `78b974b` `feat(url): URL-encoded scenario state + share button`
- `f6e637e` `fix(inputs): format $ amounts with commas + strip leading zeros`
- `e3d9acd` `feat(compare): /plan/compare side-by-side scenario overlay`

Latest confirmed green GitHub Actions runs:

- D1: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24934280814`
- input formatting: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24934369126`
- D2: `https://github.com/DhavalPatel0321/FIRE-Calculators/actions/runs/24934690173`

## What already exists

- Next.js 15 App Router + Tailwind + shadcn/ui. Fonts via `next/font`.
- Vitest (with `@vitejs/plugin-react` for TSX tests), Playwright, GitHub Actions workflow.
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
  - `/learn` — does not exist yet (E1 will create it; header and landing already link to it).
- Site chrome at [src/components/site](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/site:1) (`SiteHeader`, `SiteFooter`), mounted in [src/app/layout.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/app/layout.tsx:1).
- Planner components at [src/components/plan](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/plan:1):
  - `InputPanel` — Personal/Financial/Assumptions/Advanced. `<NumberField />` is a draft-aware text input (`type="text"`) that displays thousands separators via `formatNumberDisplay` and sanitizes via `sanitizeNumberInput`. **Don't revert to `type="number"`** — that's what allowed the leading-zero bug.
  - `ResultCards`, `GrowthChart` (with `REFERENCE_LABEL_POSITION = "insideTopRight"`, exported and regression-tested), `ScenarioUrlSync`, `CopyUrlButton`.
  - `variant-theme.ts` — `VARIANT_ORDER`, `VARIANT_THEME` (single source of truth for variant colors). Used by ResultCards, GrowthChart, and the landing page.
  - `scenario-palette.ts` — `SCENARIO_PALETTE` (slot 1 slate, slot 2 emerald, slot 3 violet). **Distinct from VARIANT_THEME.** E1 doesn't need this; D2 uses it.
  - `compare-state.ts` — `compareReducer`, `initialCompareState`, `CompareState`, `CompareAction`. Re-keys remaining scenarios after a remove so ids stay `s1..sN` with no gaps.
  - `compare-view.tsx` — the client `<CompareView />`. Owns the reducer + URL sync.

Stable data-testids (E1 / F4 can rely on these):

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
- E1 will need MDX support. **MDX is not installed yet.** Likely need `@next/mdx` + `@mdx-js/loader` + `@mdx-js/react` and a `next.config.ts` update. Check existing config first.

## Testing notes

- `src/lib/calc` coverage was brought above the required threshold during B8.
- TSX component tests run under Vitest via `@vitejs/plugin-react`. React Testing Library + jsdom works.
- For Recharts tests, mock `ResponsiveContainer` with a sized div. The same mock pattern works for `<CompareView />`.
- For `<ScenarioUrlSync />` and `<CompareView />` tests, `vi.useFakeTimers()` is required because the URL update is debounced. Use `window.history.replaceState` to seed the URL before mount.
- Last local verification (after D2):
  - `npx vitest run` — 24 files / 115 tests passing
  - `npm run typecheck`
  - `npm run build` — `/` 161 kB, `/plan` 287 kB, `/plan/compare` 277 kB
  - `npm run lint`
  - Manual dev-server smoke on `/plan/compare`: empty state renders, URL-seeded scenarios hydrate, planner-add disables at 3, removal re-keys remaining slots.
- Vitest coverage config still only tracks `src/lib/calc/**`.

## Files to inspect before starting E1

- [docs/work-plan.md](/Users/dhavalpatel/projects/FIRE-Calculators/docs/work-plan.md:1)
- [PRD.md](/Users/dhavalpatel/projects/FIRE-Calculators/PRD.md:1) §4.2 + §6.6 (SWR explainer table is the canonical source for `/learn/swr` rows)
- [next.config.ts](/Users/dhavalpatel/projects/FIRE-Calculators/next.config.ts:1) — confirm Turbopack flags before adding MDX wiring
- [src/components/site/site-header.tsx](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/site/site-header.tsx:1) — already links to `/learn`; should now lead somewhere
- [src/components/plan/variant-theme.ts](/Users/dhavalpatel/projects/FIRE-Calculators/src/components/plan/variant-theme.ts:1) — reuse `VARIANT_THEME` for variant explainer accents

## E1 restart brief

Implement exactly:

`feat(content): MDX setup + /learn layout + fire-basics`

Expected deliverables:

- MDX dependency wiring:
  - Add `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react` (and any TS shims) to `package.json`.
  - Update `next.config.ts` to register MDX (page extensions: `["ts", "tsx", "md", "mdx"]`) and configure remark/rehype plugins as needed (`remark-gfm` is a reasonable default).
  - Add an `mdx-components.tsx` at the project root for shared MDX-rendered components (headings, code blocks, links). Use Tailwind prose-style classes.
- `/learn` route at `src/app/learn/page.tsx`:
  - Server component listing the variant explainers (Coast / Barista / Lean / Fat / Traditional / SWR / Fire-basics) in cards driven by `VARIANT_THEME` where applicable.
  - Each card links to its `/learn/<slug>` page.
- `/learn/fire-basics` MDX page (E1 must ship at least this one; the other variant pages can be empty stubs that say "coming soon" or land in E2 — keep this commit focused).
  - Content covers: what FIRE is, the 4% rule one-liner, the five-variant spectrum, what `/plan` does. Pull copy from PRD §1, §3, §4.
- Shared `/learn` layout (`src/app/learn/layout.tsx`) wrapping children in a `<article className="prose ...">` shell so MDX content renders with sensible typography.
- Tests:
  - `/learn` index renders a card per planned variant (assert testids per slug, e.g. `learn-card-fire-basics`, `learn-card-coast-fire`).
  - `/learn/fire-basics` renders the headline (RTL test importing the MDX directly — confirm this works under Vitest; if not, fall back to a Playwright smoke).

Out of scope for E1:

- Per-variant explainer copy (Coast / Barista / Lean / Fat / SWR) — E2.
- SEO metadata / OG images — F1.
- A11y audit — F2.

## Working tree notes

Tracked files are clean at the stop point.

Pre-existing untracked files to leave alone unless explicitly asked:

- `FIRE-PRD.html`
- `docs/wireframes.html`
