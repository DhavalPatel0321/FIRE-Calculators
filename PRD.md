# FIRE Calculators — Product Requirements Document

**Status:** Draft v0.2
**Owner:** Dhaval Patel
**Last updated:** 2026-04-21

---

## 1. Vision

A focused, fast, and trustworthy suite of **Financial Independence / Retire Early (FIRE)** calculators. Unlike existing tools that silo one calculator per page, FIRE Calculators lets a user enter their financial picture **once** and instantly see every FIRE variant (Traditional, Coast, Barista, Lean, Fat) side-by-side, with interactive charts.

The goal is to make FIRE planning approachable for someone learning the concepts while remaining rigorous enough for a serious planner to act on. v1 is deterministic (single-point projections); probabilistic Monte Carlo analysis is a planned v2 addition (see §7).

### Feature matrix at a glance

| Feature | v1 | v2 | v3 |
| --- | :-: | :-: | :-: |
| 5 calculator variants (Traditional / Coast / Barista / Lean / Fat) | ✅ | | |
| Shared input model + live results | ✅ | | |
| Growth chart | ✅ | | |
| SWR slider (3.0%–5.0%, default 4%) + SWR explainer | ✅ | | |
| URL-shareable scenarios | ✅ | | |
| Side-by-side scenario comparison | ✅ | | |
| `/learn/*` educational pages | ✅ | | |
| Public deploy (Vercel) | ✅ | | |
| Monte Carlo simulation (parametric, success probability, percentile bands) | | ✅ | |
| Social Security offset | | ✅ | |
| Per-variant SWR defaults (Fat = 3.5%, etc.) | | ✅ | |
| Variable expense timeline | | ✅ | |
| Horizon-aware SWR suggestions | | ✅ | |
| User accounts + cloud sync | | | ✅ |
| Historical bootstrap Monte Carlo | | | ✅ |
| Multi-asset allocation with correlated returns | | | ✅ |
| Tax-aware (brackets, Roth ladders, ACA) | | | ✅ |
| Account-type granularity (401k / Roth / taxable / HSA) | | | ✅ |
| Variable-spending strategies (Guyton-Klinger, CAPE-based) | | | ✅ |
| CSV portfolio import | | | ✅ |
| Live market data | | | ✅ |

See §10 for scope per version; §4 for detailed v1 scope; §7 for v2 Monte Carlo methodology.

---

## 2. Problem

Existing FIRE calculators (WalletBurst, Networthify, Playing with FIRE, coastfirecalc.com, etc.) each do one variant well but:

- Force the user to re-enter the same inputs across separate calculators.
- Give a single deterministic number with no sense of **how likely** it is to succeed.
- Treat Coast / Barista / Traditional / Lean / Fat as disconnected tools rather than points on the same spectrum.
- Rarely let users compare scenarios ("what if I work part-time 5 years earlier?") visually.

Result: users leave without a clear answer to the real question — *"Given my savings rate and assumptions, which flavor of FIRE is realistic, and when?"*

---

## 3. Target Users

1. **The curious learner** — knows FIRE exists, wants to understand the variants and plug in their own numbers.
2. **The active planner** — already tracking their FI number, wants better tools for scenario planning.
3. **The spreadsheet refugee** — has been running their own Google Sheet, wants a nicer visual layer on top of the same math.

Not a target for v1: advisors managing multiple clients, users wanting tax-lot level planning, users with complex multi-currency portfolios.

---

## 4. Scope

### 4.1 v1 Calculators (MVP)

| Calculator | What it answers |
| --- | --- |
| **Traditional FIRE** | "What portfolio do I need to fully retire?" (25× expenses) |
| **Coast FIRE** | "How much do I need invested *today* so I never have to save again?" |
| **Barista FIRE** | "What portfolio covers the gap between my expenses and part-time income?" |
| **Lean FIRE** | Traditional FIRE assuming a reduced-expense lifestyle (~$25k–$40k/yr) |
| **Fat FIRE** | Traditional FIRE assuming a higher-expense lifestyle (~$100k+/yr) |

All five share a single input model (see §5) so users enter their profile once and all targets update live.

### 4.2 v1 Features

- **Unified input panel** — age, current net invested assets, annual contributions, expected real return, inflation, annual expenses, part-time income (for Barista), target retirement age, SWR.
- **Live calculator cards** — every variant computes in real time; shows the "your number" and "years to reach it."
- **Interactive growth chart** — portfolio trajectory over time with visual markers for each FIRE threshold crossing (Recharts or Visx).
- **Side-by-side scenario comparison** — save up to 3 scenarios and overlay their trajectories on one chart.
- **Shareable scenarios** — scenario state encoded in URL params so users can bookmark / share without accounts.
- **Educational side panels** — per-calculator explainer: the formula, key assumptions, when this variant makes sense. Includes an SWR explainer (see §6.6) covering common alternatives to the 4% default.

### 4.3 v1 Non-Goals

- No user accounts, auth, or backend database.
- **No Monte Carlo / probabilistic simulation.** v1 is deterministic only. Monte Carlo is a planned v2 feature — methodology documented in §7 for continuity.
- **No Social Security integration.** Planned for v2.
- No tax modeling (federal/state brackets, Roth conversions, ACA subsidies).
- No account-type granularity (401k vs Roth vs brokerage treated uniformly).
- No live market data — all returns are user-entered or defaulted.
- No mobile-native app (responsive web only).

---

## 5. Shared Input Model

All calculators consume this single state object:

```ts
type FireInputs = {
  currentAge: number;              // e.g. 30
  targetRetirementAge: number;     // e.g. 50 (for Coast); 65 (for traditional)
  currentInvested: number;         // $ already invested
  annualContribution: number;      // $ added per year
  annualExpenses: number;          // $ spent per year in retirement (today's dollars)
  partTimeIncome: number;          // $ per year, Barista only (0 otherwise)
  expectedRealReturn: number;      // default 7% (S&P historical post-inflation)
  inflationRate: number;           // default 3% (used only if user switches to nominal mode)
  safeWithdrawalRate: number;      // default 4%, user-configurable 3.0%–5.0% (see §6.6)
  leanExpenses?: number;           // optional override for Lean FIRE
  fatExpenses?: number;            // optional override for Fat FIRE
};
```

Real-return mode is the default. Nominal mode is available under an "advanced" toggle.

---

## 6. Formulas

All math lives in a pure, unit-tested `lib/calc/` module. No React imports, no I/O.

### 6.1 Traditional FIRE

```
fireNumber = annualExpenses / safeWithdrawalRate       // e.g. $40k / 0.04 = $1.0M

yearsToFire = solve for t in:
  currentInvested * (1 + r)^t + annualContribution * [((1 + r)^t - 1) / r] = fireNumber
```

Solved via Newton–Raphson or bisection (closed-form doesn't exist with contributions).

### 6.2 Coast FIRE

```
coastNumber = fireNumber / (1 + realReturn)^(targetRetirementAge - currentAge)
```

Reached when `currentInvested >= coastNumber`. If not reached, show years until it is (assuming current contribution rate).

### 6.3 Barista FIRE

```
baristaFireNumber = (annualExpenses - partTimeIncome) / safeWithdrawalRate
```

Same time-to-FI solver as Traditional, just with the reduced target.

### 6.4 Lean / Fat FIRE

Lean and Fat are Traditional FIRE with different `annualExpenses`. Both use the same 4% SWR default as Traditional FIRE in v1; the user can override per-scenario via the SWR input (and a per-variant SWR override is a planned v2 enhancement — see §6.6).

- **Lean**: defaults to `$35k`/yr and 4% SWR.
- **Fat**: defaults to `$150k`/yr and 4% SWR.

### 6.5 Defaults & Sources

| Input | Default | Source |
| --- | --- | --- |
| Expected real return | 7% | ~10.3% nominal S&P 1926–present minus ~3% inflation |
| Inflation | 3% | Long-run US CPI average |
| SWR (all variants) | 4% | Trinity Study (1998) / Bengen 1994 — the canonical FIRE anchor |

Every default has a tooltip linking to the rationale.

### 6.6 Safe Withdrawal Rate (SWR) — alternatives and explainer

The 4% default is the industry-standard starting point, but SWR is the single most consequential assumption in any FIRE calculation — a 1 percentage point shift changes the target portfolio by ~25%. v1 lets the user slide the SWR between 3.0% and 5.0%; the educational side panel explains when each value makes sense.

| SWR | Implied portfolio multiple | When this value makes sense | Source |
| --- | --- | --- | --- |
| **3.0%** | 33.3× expenses | Very conservative. Appropriate for 50+ year horizons, low-return environments, or users who want near-certainty of not running out. | Common "safety margin" guidance for young FIRE-seekers |
| **3.3%** | 30.3× expenses | "Safe" rate often cited for early retirees with 40+ year horizons. | ERN's Safe Withdrawal Rate series |
| **3.5%** | 28.6× expenses | Morningstar's 2026 base-case for a 30-year retirement with a 30–50% equity allocation. Good default for bond-heavy portfolios. | Morningstar 2026 SWR study |
| **3.9%** | 25.6× expenses | Morningstar 2026 base case for a stock-heavy (50%+ equity) 30-year retirement. | Morningstar 2026 SWR study |
| **4.0%** | 25.0× expenses | **Default.** Trinity Study / Bengen 1994 — the canonical FIRE anchor. Historically successful for 30-year retirements with ~60/40 allocation. | Trinity Study 1998 |
| **4.5%** | 22.2× expenses | Upper end of "reasonable." Requires flexibility (variable withdrawals). | Bengen's later research |
| **4.7%** | 21.3× expenses | Bengen's updated (2020s) research suggests this was historically safe for 30-year horizons with a broader asset mix. Aggressive for a FIRE default. | Bengen updated |

**Why 4% is the v1 default for every variant (including Fat FIRE):**

Some sources argue Fat FIRE should use a lower SWR (e.g. 3.5%) because Fat FIRE retirees often plan for 40+ year horizons where 4% has a lower historical success rate. We default all variants to 4% in v1 for simplicity — one number, one explainer, easier to reason about. Users targeting very long horizons can manually drop the slider. **Planned enhancement (v2):** per-variant SWR defaults (Lean 4%, Traditional 4%, Fat 3.5%, or user-configurable), and horizon-aware SWR suggestions driven by Monte Carlo (§7).

---

## 7. Monte Carlo Simulation (v2 — deferred)

**Status:** Not in v1. Methodology documented here so the v1 build can leave clean extension points (isolated `lib/simulation/` module, no coupling between calculators and MC).

### 7.1 Purpose

Turn a single deterministic answer ("you'll have $1.4M at 55") into a **distribution** ("you have a 87% chance of sustaining $40k/yr for 40 years"). A Monte Carlo simulation runs the portfolio-balance model thousands of times with randomly sampled annual returns, producing a probability-of-success rather than a single number. This is the standard tool for handling sequence-of-returns risk, which is invisible in deterministic projections.

### 7.2 Planned approach (v2)

- **Method:** Parametric — sample annual returns from a normal distribution defined by user's expected return (mean) and a configurable standard deviation (default 15% for a stock-heavy portfolio, based on historical S&P volatility).
- **Trials:** 1,000 by default, user-toggleable to 10,000 for more precision.
- **Horizon:** `targetRetirementAge` → `100` (user-configurable end age).
- **Withdrawal:** Inflation-adjusted annual withdrawal equal to `annualExpenses`.
- **Success definition:** Portfolio ≥ $0 at end of horizon.
- **Outputs:**
  - **Success probability** (0–100%)
  - **Percentile bands** (10th / 50th / 90th) charted over time
  - **Median ending balance**
  - **Failure-age distribution** for failed runs ("if this plan fails, when does it usually fail?")

### 7.3 Caveats (will be shown prominently in UI when shipped)

- Normal distribution underweights tail events vs. real markets (no fat tails, no serial correlation).
- No sequence-of-returns correlation across asset classes (single-asset model).
- Results are **directional, not predictive**.

### 7.4 v3+ Enhancements

- **Historical bootstrap** mode: sample actual rolling years from 1926–present rather than drawing from a normal distribution.
- Multi-asset (stock/bond) allocation with correlated sampling.
- Variable-spending strategies (Guyton-Klinger guardrails, etc.).
- Horizon-aware SWR suggestions driven by MC success-rate targets (feeds back into §6.6).

---

## 8. UX / Information Architecture

```
/                     Landing — explainer + "Start planning" CTA
/plan                 Main planner — input panel + 5 calculator cards + chart
/plan/compare         Multi-scenario overlay view
/plan/monte-carlo     (v2) Monte Carlo deep-dive for the current scenario
/learn/coast-fire     Per-variant explainer page (SEO + education)
/learn/barista-fire
/learn/lean-fire
/learn/fat-fire
/learn/fire-basics
/learn/swr            Explainer for SWR alternatives (see §6.6)
```

### Key UI principles

- Inputs are always visible (left panel or top), results are always responsive — no "calculate" button.
- Every number has a tooltip explaining what it means and how it was computed.
- Charts use color consistently per FIRE variant across the app.
- Mobile-first: inputs collapse to a sheet on small screens.

---

## 9. Tech Stack

| Layer | Choice | Rationale |
| --- | --- | --- |
| Framework | **Next.js 15 (App Router)** + TypeScript | SSG-friendly for `/learn` content, good Vercel/Netlify deploy story, matches user's preference |
| Styling | **Tailwind CSS** + shadcn/ui | Fast iteration, accessible primitives |
| Charts | **Recharts** (v1), consider Visx later | Declarative, good enough for trajectories & percentile bands |
| State | **Zustand** or React Context + URL search params | Scenario state must be URL-shareable |
| Math | Pure TS in `lib/calc/` | Unit-testable with Vitest; no framework coupling |
| Testing | **Vitest** (unit) + **Playwright** (e2e smoke) | Fast, modern |
| Deployment | **Vercel** (target) | Zero-config Next.js hosting; preview URLs for scenario sharing |
| Analytics | Plausible or Vercel Analytics (phase 2) | Privacy-respecting, no cookies |

### Repo layout

```
FIRE-Calculators/
├── PRD.md
├── README.md
├── docs/
│   ├── formulas.md         # Derivations + references
│   └── monte-carlo.md      # Simulation methodology
├── src/
│   ├── app/                # Next.js App Router pages
│   ├── components/         # UI components
│   ├── lib/
│   │   ├── calc/           # Pure math (FIRE formulas, solvers) — v1
│   │   └── simulation/     # Monte Carlo engine — v2 (empty in v1)
│   └── types/
├── tests/
│   └── calc.test.ts
└── package.json
```

---

## 10. Roadmap (v1 / v2 / v3)

This project is organized around **dual-track development**: v1 ships while v2 is being discovered/refined, and v2 ships while v3 is being discovered. Each version below is self-contained — a "done" definition — so the v2/v3 lists can evolve independently while v1 is under construction.

### v1 — Deterministic MVP  *(in flight — 7 weeks)*

**Goal:** A polished, public, deterministic FIRE planner that lets a user enter their numbers once and see all 5 variants + a shared growth chart, plus scenario comparison.

**Scope:**
- Next.js 15 + Tailwind + shadcn/ui scaffold, deployed to Vercel.
- `lib/calc/` — pure TS module with Traditional / Coast / Barista / Lean / Fat formulas + Newton solver, unit-tested to match reference calculators within 1%.
- Single-page planner: input panel + 5 result cards + growth chart (Recharts).
- SWR slider (3.0%–5.0%, default 4%) and SWR explainer page (§6.6).
- URL-based scenario persistence — no accounts.
- Side-by-side scenario comparison (up to 3 scenarios).
- `/learn/*` explainer pages (MDX) for each variant.
- SEO / OG images / sitemap / accessibility audit / analytics.

**Done when:** Deployed publicly, all reference scenarios match industry calculators, Lighthouse ≥ 90 across the board.

---

### v2 — Probabilistic & Lifecycle  *(planning in parallel with v1)*

**Theme:** Handle uncertainty and life events. Move from "point estimate" to "probability distribution and timeline."

**Scope:**
- **Monte Carlo simulation** (parametric, per §7) — `/plan/monte-carlo` view with success probability, 10/50/90 percentile bands, and failure-age histogram. New isolated `lib/simulation/` module.
- **Social Security integration** — expected benefit input (monthly $ + start age) that offsets `annualExpenses` starting at benefit age.
- **Per-variant SWR defaults** — Lean/Traditional default 4%, Fat defaults 3.5% for long horizons, all user-overridable per scenario.
- **Variable expense timeline** — expenses can change over time (mortgage payoff, kids out of house, healthcare cliff).
- **Horizon-aware SWR suggestions** — Monte Carlo feeds back a "suggested SWR" for the user's horizon and target success rate (80% / 90% / 95%).

**Open questions to resolve during v1:** parametric vs historical-bootstrap MC; whether to ship a historical return dataset; UI pattern for time-varying expenses.

**Done when:** A user can meaningfully answer "what's the probability my plan survives?" and model a realistic retirement with SS income and changing expenses.

---

### v3 — Realism & Optimization  *(longer horizon — discover in parallel with v2)*

**Theme:** Move from "single-asset deterministic user" to "realistic multi-asset portfolio with tax-aware strategies."

**Candidate scope (not committed):**
- **User accounts + cloud sync** — Supabase or Clerk + Postgres; scenarios persist across devices.
- **Historical bootstrap Monte Carlo** — sample actual rolling years from 1926–present (replaces or complements parametric MC).
- **Multi-asset allocation** — stock/bond/cash splits with correlated return sampling.
- **Tax-aware FIRE** — federal/state tax brackets, Roth conversion ladders, ACA subsidy cliffs, tax-loss harvesting assumptions.
- **Account-type granularity** — 401k / Roth IRA / taxable brokerage / HSA treated distinctly with contribution limits and withdrawal rules.
- **Variable-spending withdrawal strategies** — Guyton-Klinger guardrails, CAPE-based dynamic SWR.
- **CSV import** of portfolio holdings from major brokerages.
- **Live market data** — optional integration for current portfolio valuation.

**Open questions to explore during v2:** which tax strategies to prioritize; whether accounts should be first-class or just a sync layer; should this become a paid tier?

**Done when:** The tool is rigorous enough that someone within 5 years of retirement could use it as their primary planner.

---

## 11. Success Metrics

**Pre-launch (local / personal):**
- All calculators produce numbers that match WalletBurst / coastfirecalc.com within 1% on a set of 10 reference scenarios.
- Unit test coverage ≥ 90% on `lib/calc/` (v1). `lib/simulation/` coverage target applies once that module ships in v2.

**Post-launch (web):**
- Time-on-page > 2 min median on `/plan`.
- Scenario share URL click-through (people sharing their plans).
- Return-visitor rate — do people come back to re-run their plan?

---

## 12. Resolved Decisions

- **Social Security** — deferred to v2 (Phase 5).
- **Monte Carlo** — deferred to v2 (Phase 5). Methodology kept in §7 for design continuity.
- **SWR default** — 4% for every variant in v1. The SWR explainer (§6.6) covers the common alternatives (3.0% / 3.5% / 3.9% / 4.5% / 4.7%) so users can pick with context. Per-variant defaults move to v2.

## 13. Open Questions

1. **Nominal vs real.** Default to real returns (current plan) or nominal with an inflation adjustment? Real is simpler math; nominal is what users see in their brokerage app.
2. **Charts library.** Recharts is the fast path, but Visx gives more control if we later want custom percentile-band rendering (v2). Decide at Phase 2 kickoff.
3. **Monte Carlo method for v2.** Parametric vs historical bootstrap — bootstrap is more defensible but requires shipping a historical return dataset. Revisit at Phase 5 kickoff.

---

## 14. References

- Trinity Study / 4% Rule: https://en.wikipedia.org/wiki/Trinity_study
- WalletBurst FIRE tools: https://walletburst.com/tools/
- Coast FIRE math: https://walletburst.com/tools/coast-fire-calc/
- Barista FIRE: https://walletburst.com/tools/barista-fire-calc/
- Morningstar 2026 SWR guidance (referenced via Poor Swiss 2026 update): https://thepoorswiss.com/updated-trinity-study/
- Monte Carlo retirement methodology: https://www.portfoliovisualizer.com/monte-carlo-simulation
- Kitces on Monte Carlo success thresholds: https://www.kitces.com/blog/monte-carlo-retirement-projection-probability-success-adjustment-minimum-odds/
