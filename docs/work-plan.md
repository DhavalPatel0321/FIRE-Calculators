# FIRE Calculators v1 Work Plan

Last updated: 2026-04-22
Current head when this tracker was added: `54378c1`

## How to use this checklist

- This file tracks the required A1-F5 implementation sequence from the build prompt.
- Update this file in the same commit that implements a checklist item so the tracker stays in sync with `main`.
- Mark an item `[x]` only after the local gates for that commit are passing and the change is ready to push.
- After pushing, wait for GitHub Actions to go green before starting the next unchecked item.
- Do not skip items or batch multiple unchecked items into one commit.
- The authoritative scope remains `PRD.md` v1 only: §1 feature matrix and §10 v1 scope.

## Notes

- The checklist below tracks the required product-build commits only.
- Separate documentation-only commits requested during implementation are useful breadcrumbs, but they do not replace any unchecked product item below.
- An ad hoc pre-E1 quality-of-life sprint was inserted after D2 to fix route continuity and share-flow polish. It does not replace E1 and should not mark any Track E checkbox.

## Track A — Foundation

- [x] A1 `chore: scaffold Next.js 15 + TypeScript + Tailwind`
- [x] A2 `chore: configure Vitest + Playwright + CI`
- [x] A3 `chore: install shadcn/ui, Recharts, Zustand`

## Track B — Calc Core

- [x] B1 `feat(calc): add FireInputs type, defaults, and SWR presets`
- [x] B2 `feat(calc): Newton-Raphson solver with bisection fallback`
- [x] B3 `feat(calc): Traditional FIRE formula`
- [x] B4 `feat(calc): Coast FIRE formula`
- [x] B5 `feat(calc): Barista FIRE formula`
- [x] B6 `feat(calc): Lean and Fat FIRE variants`
- [x] B7 `feat(calc): year-by-year portfolio projection`
- [x] B8 `feat(calc): scenario aggregator + reference scenarios test suite`

## Track C — Planner UI

- [x] C1 `feat(ui): /plan page skeleton + Zustand store`
- [x] C2 `feat(ui): input panel component wired to store`
- [x] C3 `feat(ui): result cards (5 calculator variants)`
- [x] C4 `feat(ui): portfolio growth chart`
- [x] C5 `feat(ui): landing page + header/footer`

## Track D — Persistence & Comparison

- [x] D1 `feat(url): URL-encoded scenario state + share button`
- [x] D2 `feat(compare): /plan/compare side-by-side scenario overlay`

## Track E — Content

- [x] E1 `feat(content): MDX setup + /learn layout + fire-basics`
- [x] E2 `feat(content): per-variant and SWR explainer pages`

## Track F — Polish & Ship

- [x] F1 `feat(seo): metadata, OG images, sitemap, robots.txt`
- [x] F2 `feat(a11y): keyboard nav, labels, focus, contrast audit`
- [x] F3 `feat(analytics): Vercel Analytics`
- [ ] F4 `test(e2e): Playwright golden-path smoke test`
- [ ] F5 `chore: deploy to Vercel (production) + README update`
