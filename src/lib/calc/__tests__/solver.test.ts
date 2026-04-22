import { describe, expect, it } from "vitest";

import { yearsToReachTarget } from "@/lib/calc/solver";

type SolverTestInputs = {
  currentInvested: number;
  annualContribution: number;
  expectedRealReturn: number;
  target: number;
};

function calculateYearsToTarget({
  currentInvested,
  annualContribution,
  expectedRealReturn,
  target,
}: SolverTestInputs) {
  return yearsToReachTarget({
    V0: currentInvested,
    C: annualContribution,
    r: expectedRealReturn,
    target,
  });
}

function calculatePortfolioValueAtYears(
  years: number,
  {
    currentInvested,
    annualContribution,
    expectedRealReturn,
  }: Omit<SolverTestInputs, "target">,
) {
  const growthFactor = (1 + expectedRealReturn) ** years;

  if (expectedRealReturn === 0) {
    return currentInvested + annualContribution * years;
  }

  return (
    currentInvested * growthFactor +
    annualContribution * ((growthFactor - 1) / expectedRealReturn)
  );
}

describe("yearsToReachTarget", () => {
  it("returns 0 when the target is already reached", () => {
    expect(
      calculateYearsToTarget({
        currentInvested: 1_000_000,
        annualContribution: 20_000,
        expectedRealReturn: 0.07,
        target: 800_000,
      }),
    ).toBe(0);
  });

  it("uses the linear solution when real return is zero", () => {
    expect(
      calculateYearsToTarget({
        currentInvested: 200_000,
        annualContribution: 5_000,
        expectedRealReturn: 0,
        target: 1_500_000,
      }),
    ).toBe(260);
  });

  it("returns infinity when return and contribution are both zero below target", () => {
    expect(
      calculateYearsToTarget({
        currentInvested: 200_000,
        annualContribution: 0,
        expectedRealReturn: 0,
        target: 1_500_000,
      }),
    ).toBe(Number.POSITIVE_INFINITY);
  });

  it("uses the closed-form compounding solution when contributions are zero", () => {
    const yearsToTarget = calculateYearsToTarget({
      currentInvested: 100_000,
      annualContribution: 0,
      expectedRealReturn: 0.07,
      target: 200_000,
    });

    expect(yearsToTarget).toBeCloseTo(
      Math.log(2) / Math.log(1.07),
      10,
    );
  });

  it("returns infinity when growth-only mode starts from zero below target", () => {
    expect(
      calculateYearsToTarget({
        currentInvested: 0,
        annualContribution: 0,
        expectedRealReturn: 0.07,
        target: 100_000,
      }),
    ).toBe(Number.POSITIVE_INFINITY);
  });

  it("solves a standard accumulation case", () => {
    const accumulationInputs = {
      currentInvested: 50_000,
      annualContribution: 20_000,
      expectedRealReturn: 0.07,
      target: 1_000_000,
    };
    const yearsToTarget = calculateYearsToTarget(accumulationInputs);

    expect(
      calculatePortfolioValueAtYears(yearsToTarget, accumulationInputs),
    ).toBeCloseTo(accumulationInputs.target, 2);
  });

  it("falls back to the bounded bisection search when Newton steps outside the search interval", () => {
    const yearsToTarget = calculateYearsToTarget({
      currentInvested: 1_000,
      annualContribution: 1_000,
      expectedRealReturn: 0.07,
      target: 1_000_000_000_000,
    });

    expect(yearsToTarget).toBeCloseTo(100, 10);
  });
});
