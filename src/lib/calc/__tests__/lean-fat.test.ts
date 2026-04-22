import { describe, expect, it } from "vitest";

import {
  calculateFatFire,
  calculateLeanFire,
} from "@/lib/calc/variants/lean-fat";

describe("calculateLeanFire", () => {
  it("uses the v1 default lean expense assumption", () => {
    const result = calculateLeanFire({
      currentAge: 28,
      targetRetirementAge: 50,
      currentInvested: 30_000,
      annualContribution: 25_000,
      annualExpenses: 60_000,
      partTimeIncome: 0,
      expectedRealReturn: 0.07,
      inflationRate: 0.03,
      safeWithdrawalRate: 0.04,
    });

    expect(result.target).toBe(875_000);
    expect(result.variant).toBe("lean");
    expect(result.alreadyReached).toBe(false);
    expect(result.yearsToReach).toBeCloseTo(17.111, 3);
  });

  it("uses leanExpenses when provided", () => {
    const result = calculateLeanFire({
      currentAge: 35,
      targetRetirementAge: 60,
      currentInvested: 500_000,
      annualContribution: 0,
      annualExpenses: 80_000,
      partTimeIncome: 0,
      expectedRealReturn: 0.05,
      inflationRate: 0.03,
      safeWithdrawalRate: 0.04,
      leanExpenses: 28_000,
    });

    expect(result.target).toBe(700_000);
    expect(result.variant).toBe("lean");
  });
});

describe("calculateFatFire", () => {
  it("uses the v1 default fat expense assumption", () => {
    const result = calculateFatFire({
      currentAge: 45,
      targetRetirementAge: 65,
      currentInvested: 800_000,
      annualContribution: 30_000,
      annualExpenses: 90_000,
      partTimeIncome: 0,
      expectedRealReturn: 0.07,
      inflationRate: 0.03,
      safeWithdrawalRate: 0.04,
    });

    expect(result.target).toBe(3_750_000);
    expect(result.variant).toBe("fat");
    expect(result.alreadyReached).toBe(false);
    expect(result.yearsToReach).toBeCloseTo(18.093, 3);
  });

  it("uses fatExpenses when provided", () => {
    const result = calculateFatFire({
      currentAge: 40,
      targetRetirementAge: 65,
      currentInvested: 5_000_000,
      annualContribution: 0,
      annualExpenses: 120_000,
      partTimeIncome: 0,
      expectedRealReturn: 0.05,
      inflationRate: 0.03,
      safeWithdrawalRate: 0.04,
      fatExpenses: 180_000,
    });

    expect(result.target).toBe(4_500_000);
    expect(result.variant).toBe("fat");
    expect(result.alreadyReached).toBe(true);
  });
});
