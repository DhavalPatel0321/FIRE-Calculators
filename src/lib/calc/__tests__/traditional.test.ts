import { describe, expect, it } from "vitest";

import { calculateTraditionalFire } from "@/lib/calc/variants/traditional";

describe("calculateTraditionalFire", () => {
  it("matches scenario 1 from the reference set", () => {
    const result = calculateTraditionalFire({
      currentAge: 30,
      targetRetirementAge: 65,
      currentInvested: 50_000,
      annualContribution: 20_000,
      annualExpenses: 40_000,
      partTimeIncome: 0,
      expectedRealReturn: 0.07,
      inflationRate: 0.03,
      safeWithdrawalRate: 0.04,
    });

    expect(result).toMatchObject({
      target: 1_000_000,
      alreadyReached: false,
      variant: "traditional",
    });

    expect(result.yearsToReach).toBeCloseTo(19.8468, 3);
  });

  it("marks scenario 6 as already reached", () => {
    const result = calculateTraditionalFire({
      currentAge: 30,
      targetRetirementAge: 65,
      currentInvested: 1_000_000,
      annualContribution: 0,
      annualExpenses: 40_000,
      partTimeIncome: 0,
      expectedRealReturn: 0.07,
      inflationRate: 0.03,
      safeWithdrawalRate: 0.04,
    });

    expect(result).toEqual({
      target: 1_000_000,
      yearsToReach: 0,
      alreadyReached: true,
      variant: "traditional",
    });
  });
});
