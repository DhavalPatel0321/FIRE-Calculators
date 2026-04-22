# Monte Carlo Methodology

How `src/lib/simulation/` turns a single FIRE number into a probability distribution.

## Why Monte Carlo

Deterministic FIRE math says "you need $1M and you'll hit it at 45." Reality:

- Markets don't return exactly 7% every year.
- Sequence-of-returns risk — a crash in year 1 of retirement hurts far more than the same crash 20 years in.
- A 4% SWR that "works" historically still fails in a non-trivial fraction of simulated futures, especially for 40+ year horizons.

Monte Carlo answers: **"Given the uncertainty, what's the probability this plan survives the full horizon?"**

## v1 Approach: parametric normal-distribution sampling

For each trial (default 1,000):

1. For each year from `targetRetirementAge` to end age (default 100):
   - Sample annual return `r_i ~ Normal(μ, σ)` where `μ = expectedRealReturn` (default 7%), `σ = 15%` (stock-heavy default).
   - `balance *= (1 + r_i)`.
   - Withdraw `annualExpenses` (inflation-adjusted — since we work in real dollars, no adjustment needed).
2. If `balance < 0` at any point, mark the trial as failed with that year as the failure age.
3. Else, record final balance.

## Outputs

- **Success rate** — percent of trials with `balance ≥ 0` at end of horizon.
- **Percentile bands (10 / 50 / 90)** over time — chart overlay.
- **Median ending balance** among successful trials.
- **Failure-age histogram** — for failed trials, when did they run out? (Exposes sequence-of-returns risk visually.)

## Caveats shown in UI

- Normal distribution **underweights tail events** (2008, 1929). Real markets have fat tails.
- **No serial correlation** — in reality, bad years cluster (bear markets).
- **Single-asset model** — no bond/stock correlation dynamics in v1.
- Results are **directional**, not predictive. Aim for 80–95% success rate rather than chasing 100% (Kitces).

## v2 enhancements

### Historical bootstrap

Instead of sampling from a normal distribution, sample actual rolling years from historical return data (1926–present for S&P 500, 1928–present for 10-yr Treasuries). Preserves fat tails and serial correlation structure.

Requires bundling a historical return dataset (~100 rows of CSV — small).

### Multi-asset allocation

User specifies stock/bond split. Sample correlated returns from a joint distribution (or correlated bootstrap). More realistic for someone holding a real portfolio rather than 100% stocks.

### Variable withdrawal strategies

Instead of constant inflation-adjusted withdrawal, implement:
- **Guyton-Klinger guardrails** — cut spending after bad years, raise after good ones.
- **CAPE-based withdrawal** — dynamic SWR based on market valuation at retirement start.

These dramatically improve success rates vs. rigid 4% and reflect how real retirees actually behave.

## Performance

1,000 trials × 50 years = 50,000 RNG samples + arithmetic per simulation run. Should complete in <50ms on a modern laptop in pure JS. If 10,000 trials becomes sluggish, move to a Web Worker.

## References

- Portfolio Visualizer Monte Carlo: https://www.portfoliovisualizer.com/monte-carlo-simulation
- Kitces on the "50% success rate" adjustment framing: https://www.kitces.com/blog/monte-carlo-retirement-projection-probability-success-adjustment-minimum-odds/
- T. Rowe Price on Monte Carlo for retirement: https://www.troweprice.com/personal-investing/resources/insights/how-monte-carlo-analysis-could-improve-your-retirement-plan.html
