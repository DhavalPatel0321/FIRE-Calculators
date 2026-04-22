import { describe, expect, it } from "vitest";

import { calculateCoastFire } from "@/lib/calc/variants/coast";

describe("calculateCoastFire", () => {
  it("matches scenario 2 from the reference set", () => {
    const expectedTarget = 48_000 / 0.04 / 1.07 ** 30;
    const result = calculateCoastFire({
      currentAge: 35,
      targetRetirementAge: 65,
      currentInvested: 100_000,
      annualContribution: 15_000,
      annualExpenses: 48_000,
      partTimeIncome: 0,
      expectedRealReturn: 0.07,
      inflationRate: 0.03,
      safeWithdrawalRate: 0.04,
    });

    expect(result.target).toBeCloseTo(expectedTarget, 10);
    expect(result.alreadyReached).toBe(false);
    expect(result.variant).toBe("coast");
    expect(result.yearsToReach).toBeCloseTo(2.489, 3);
  });

  it("matches the WalletBurst displayed coast number for its default example", () => {
    const result = calculateCoastFire({
      currentAge: 30,
      targetRetirementAge: 67,
      currentInvested: 100_000,
      annualContribution: 6_000,
      annualExpenses: 30_000,
      partTimeIncome: 0,
      expectedRealReturn: 0.04,
      inflationRate: 0.03,
      safeWithdrawalRate: 0.04,
    });

    expect(Math.round(result.target)).toBe(175_723);
    expect(result.alreadyReached).toBe(false);
  });
});
