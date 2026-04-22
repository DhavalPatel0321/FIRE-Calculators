import { describe, expect, it } from "vitest";

import { projectPortfolio } from "@/lib/calc/projection";

describe("projectPortfolio", () => {
  it("matches the linear projection when returns are zero", () => {
    const projection = projectPortfolio(
      {
        currentAge: 30,
        targetRetirementAge: 33,
        currentInvested: 100_000,
        annualContribution: 10_000,
        annualExpenses: 40_000,
        partTimeIncome: 0,
        expectedRealReturn: 0,
        inflationRate: 0.03,
        safeWithdrawalRate: 0.04,
      },
      5,
    );

    expect(projection.map((point) => point.portfolio)).toEqual([
      100_000,
      110_000,
      120_000,
      130_000,
      130_000,
      130_000,
    ]);
    expect(projection.map((point) => point.age)).toEqual([30, 31, 32, 33, 34, 35]);
  });

  it("matches pure compounding when contributions are zero", () => {
    const initialPortfolio = 200_000;
    const expectedRealReturn = 0.05;
    const projection = projectPortfolio(
      {
        currentAge: 40,
        targetRetirementAge: 65,
        currentInvested: initialPortfolio,
        annualContribution: 0,
        annualExpenses: 60_000,
        partTimeIncome: 0,
        expectedRealReturn,
        inflationRate: 0.03,
        safeWithdrawalRate: 0.04,
      },
      3,
    );

    projection.forEach((point) => {
      expect(point.portfolio).toBeCloseTo(
        initialPortfolio * (1 + expectedRealReturn) ** point.year,
        10,
      );
    });
  });
});
