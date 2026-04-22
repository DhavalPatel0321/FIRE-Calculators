import { describe, expect, it } from "vitest";

import { calculateBaristaFire } from "@/lib/calc/variants/barista";

describe("calculateBaristaFire", () => {
  it("matches scenario 3 from the reference set", () => {
    const result = calculateBaristaFire({
      currentAge: 40,
      targetRetirementAge: 60,
      currentInvested: 500_000,
      annualContribution: 10_000,
      annualExpenses: 48_000,
      partTimeIncome: 18_000,
      expectedRealReturn: 0.06,
      inflationRate: 0.03,
      safeWithdrawalRate: 0.04,
    });

    expect(result).toEqual({
      target: 750_000,
      yearsToReach: result.yearsToReach,
      alreadyReached: false,
      variant: "barista",
    });
    expect(result.yearsToReach).toBeCloseTo(5.465, 3);
  });

  it("treats part-time income that fully covers expenses as already reached", () => {
    const result = calculateBaristaFire({
      currentAge: 35,
      targetRetirementAge: 60,
      currentInvested: 25_000,
      annualContribution: 5_000,
      annualExpenses: 40_000,
      partTimeIncome: 50_000,
      expectedRealReturn: 0.07,
      inflationRate: 0.03,
      safeWithdrawalRate: 0.04,
    });

    expect(result).toEqual({
      target: 0,
      yearsToReach: 0,
      alreadyReached: true,
      variant: "barista",
    });
  });
});
