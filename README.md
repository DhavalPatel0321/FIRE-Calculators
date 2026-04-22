# FIRE Calculators

A suite of Financial Independence / Retire Early calculators: Traditional, Coast, Barista, Lean, and Fat FIRE — one shared input model, side-by-side results, and interactive charts.

**Status:** Planning (v1 spec ready, not yet scaffolded). See [PRD.md](./PRD.md) for the full product spec.

## Development model

Dual-track development: v1 ships while v2 is being refined, and v2 ships while v3 is being refined.

- **v1** — deterministic MVP (5 calculators, shared inputs, growth chart, scenario comparison, public deploy).
- **v2** — Monte Carlo simulation, Social Security, per-variant SWR defaults, variable expense timelines.
- **v3** — accounts, historical-bootstrap MC, multi-asset allocation, tax-aware FIRE, account-type granularity.

Full breakdown: see [`PRD.md` §10](./PRD.md).

---

## Planned stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Recharts for charts
- Vitest for unit tests
- Vercel for deployment

## Next steps

1. Review and approve [PRD.md](./PRD.md).
2. Initialize Next.js app: `npx create-next-app@latest . --typescript --tailwind --app --eslint`.
3. Build out `src/lib/calc/` pure-math module first (TDD — formulas have well-known answers).
4. Wire up the single-page planner UI.

## Structure

```
FIRE-Calculators/
├── PRD.md              ← start here
├── README.md
├── docs/
│   ├── formulas.md     ← formula derivations + references
│   └── monte-carlo.md  ← simulation methodology (v2)
└── src/                ← Next.js app (not yet scaffolded)
```
