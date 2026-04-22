# FIRE Formulas

Reference for the math in `src/lib/calc/`. All inputs are in real (inflation-adjusted) dollars unless stated otherwise.

## Variables

- `A` — annual expenses in retirement
- `P` — part-time income (Barista only)
- `r` — expected annual real return (default 0.07)
- `swr` — safe withdrawal rate (default 0.04)
- `C` — annual contribution
- `V0` — current invested assets
- `n` — years until target retirement age

---

## 1. Traditional FIRE

**FIRE number:**

```
FIRE = A / swr
```

Example: `$40,000 / 0.04 = $1,000,000`.

**Years to reach it** — solve for `t` in the future-value-of-annuity equation:

```
V0 * (1 + r)^t  +  C * [((1 + r)^t − 1) / r]  =  FIRE
```

No closed-form solution when both `V0` and `C` are nonzero. Use Newton–Raphson or bisection.

---

## 2. Coast FIRE

Amount you need invested *today* such that, with zero further contributions, compound growth alone reaches `FIRE` by `targetRetirementAge`.

```
CoastFIRE = FIRE / (1 + r)^n
```

Example: `$1.5M target, 30 years out, 7% real return  →  $1.5M / 1.07^30 ≈ $197,106`.

If `V0 >= CoastFIRE`, the user has hit Coast FIRE. Otherwise the calculator shows years until they will (using the same solver as Traditional, but targeting `CoastFIRE` instead of `FIRE`).

---

## 3. Barista FIRE

Portfolio target when part-time work covers part of expenses.

```
BaristaFIRE = (A − P) / swr
```

Example: expenses `$48k`, part-time income `$18k`, SWR 4% → `$30k / 0.04 = $750,000`.

Years-to-Barista uses the same solver against this reduced target.

---

## 4. Lean FIRE / Fat FIRE

Structural variants of Traditional FIRE with different defaults:

| Variant | Default expenses | Default SWR |
| --- | --- | --- |
| Lean FIRE | $35,000 | 4.0% |
| Fat FIRE | $150,000 | 3.5% |

Fat FIRE uses a lower SWR because Fat FIRE retirees often retire earlier and plan for 40+ year horizons, where 4% has historically dropped below ~90% success.

---

## 5. Newton–Raphson solver

Given target `F`, solve:

```
f(t) = V0 * (1 + r)^t + C * ((1 + r)^t − 1) / r − F = 0
f'(t) = ln(1 + r) * (1 + r)^t * (V0 + C / r)
```

Initial guess `t₀ = 10`, iterate `t_{k+1} = t_k − f(t_k) / f'(t_k)` until `|f(t_k)| < 0.01` or 50 iterations. Fall back to bisection on `[0, 100]` if Newton doesn't converge.

Edge case: `V0 >= F` → return `0` (already there). Edge case: `r = 0` → degenerate; return `(F − V0) / C`.

---

## 6. Default sources

- **Real return 7%**: S&P 500 long-run nominal ~10.3% (1926–present) minus ~3% inflation.
- **Inflation 3%**: long-run US CPI average.
- **4% SWR**: Trinity Study (1998) and Bengen (1994) for 30-year horizons, ~50/50 stocks/bonds.
- **3.5% SWR for Fat FIRE**: Morningstar 2026 base-case guidance for long retirement horizons.
