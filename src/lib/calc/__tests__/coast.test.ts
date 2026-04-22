import { describe, expect, it } from "vitest";

import { calculateCoastFire } from "@/lib/calc/variants/coast";

describe("calculateCoastFire", () => {
  it("matches scenario 2 from the reference set", () => {
    const expectedTarget = 48_000 / 0.04 / 1.07 ** 30;
    const coastFireResult = calculateCoastFire({
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

    expect(coastFireResult.target).toBeCloseTo(expectedTarget, 10);
    expect(coastFireResult.alreadyReached).toBe(false);
    expect(coastFireResult.variant).toBe("coast");
    expect(coastFireResult.yearsToReach).toBeCloseTo(2.489, 3);
  });

  it("matches the WalletBurst displayed coast number for its default example", () => {
    const coastFireResult = calculateCoastFire({
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

    expect(Math.round(coastFireResult.target)).toBe(175_723);
    expect(coastFireResult.alreadyReached).toBe(false);
  });
});
