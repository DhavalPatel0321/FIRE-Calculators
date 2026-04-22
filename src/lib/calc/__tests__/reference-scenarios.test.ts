import { describe, expect, it } from "vitest";

import { computeAllVariants } from "@/lib/calc";
import type { FireInputs, FireVariant } from "@/lib/calc";

const TARGET_TOLERANCE_PERCENT = 0.01;
const YEARS_TOLERANCE = 0.2;

type ReferenceScenario = {
  name: string;
  inputs: FireInputs;
  variant: FireVariant;
  expectedTarget: number;
  expectedYears: number;
  expectedAlreadyReached: boolean;
};

function expectWithinPercent(actual: number, expected: number, percent: number) {
  const tolerance = expected * percent;

  expect(actual).toBeGreaterThanOrEqual(expected - tolerance);
  expect(actual).toBeLessThanOrEqual(expected + tolerance);
}

const referenceScenarios: ReferenceScenario[] = [
  {
    name: "scenario 1 traditional",
    variant: "traditional",
    inputs: {
      currentAge: 30,
      targetRetirementAge: 65,
      currentInvested: 50_000,
      annualContribution: 20_000,
      annualExpenses: 40_000,
      partTimeIncome: 0,
      expectedRealReturn: 0.07,
      inflationRate: 0.03,
      safeWithdrawalRate: 0.04,
    },
    expectedTarget: 1_000_000,
    expectedYears: 19.846823421248853,
    expectedAlreadyReached: false,
  },
  {
    name: "scenario 2 coast",
    variant: "coast",
    inputs: {
      currentAge: 35,
      targetRetirementAge: 65,
      currentInvested: 100_000,
      annualContribution: 15_000,
      annualExpenses: 48_000,
      partTimeIncome: 0,
      expectedRealReturn: 0.07,
      inflationRate: 0.03,
      safeWithdrawalRate: 0.04,
    },
    expectedTarget: 157640.54058550752,
    expectedYears: 2.488862969257636,
    expectedAlreadyReached: false,
  },
  {
    name: "scenario 3 barista",
    variant: "barista",
    inputs: {
      currentAge: 40,
      targetRetirementAge: 60,
      currentInvested: 500_000,
      annualContribution: 10_000,
      annualExpenses: 48_000,
      partTimeIncome: 18_000,
      expectedRealReturn: 0.06,
      inflationRate: 0.03,
      safeWithdrawalRate: 0.04,
    },
    expectedTarget: 750_000,
    expectedYears: 5.4652428090977185,
    expectedAlreadyReached: false,
  },
  {
    name: "scenario 4 lean",
    variant: "lean",
    inputs: {
      currentAge: 28,
      targetRetirementAge: 50,
      currentInvested: 30_000,
      annualContribution: 25_000,
      annualExpenses: 35_000,
      partTimeIncome: 0,
      expectedRealReturn: 0.07,
      inflationRate: 0.03,
      safeWithdrawalRate: 0.04,
    },
    expectedTarget: 875_000,
    expectedYears: 17.111135887880934,
    expectedAlreadyReached: false,
  },
  {
    name: "scenario 5 fat",
    variant: "fat",
    inputs: {
      currentAge: 45,
      targetRetirementAge: 65,
      currentInvested: 800_000,
      annualContribution: 30_000,
      annualExpenses: 150_000,
      partTimeIncome: 0,
      expectedRealReturn: 0.07,
      inflationRate: 0.03,
      safeWithdrawalRate: 0.04,
    },
    expectedTarget: 3_750_000,
    expectedYears: 18.092548373799684,
    expectedAlreadyReached: false,
  },
  {
    name: "scenario 6 already FI",
    variant: "traditional",
    inputs: {
      currentAge: 30,
      targetRetirementAge: 65,
      currentInvested: 1_000_000,
      annualContribution: 0,
      annualExpenses: 40_000,
      partTimeIncome: 0,
      expectedRealReturn: 0.07,
      inflationRate: 0.03,
      safeWithdrawalRate: 0.04,
    },
    expectedTarget: 1_000_000,
    expectedYears: 0,
    expectedAlreadyReached: true,
  },
  {
    name: "scenario 7 zero-return degenerate case",
    variant: "traditional",
    inputs: {
      currentAge: 50,
      targetRetirementAge: 65,
      currentInvested: 200_000,
      annualContribution: 5_000,
      annualExpenses: 60_000,
      partTimeIncome: 0,
      expectedRealReturn: 0,
      inflationRate: 0.03,
      safeWithdrawalRate: 0.04,
    },
    expectedTarget: 1_500_000,
    expectedYears: 260,
    expectedAlreadyReached: false,
  },
];

describe("reference scenarios", () => {
  // Some prompt-level year estimates conflict with `PRD.md` and `docs/formulas.md`.
  // These expectations follow the documented formulas, which the user approved.
  it.each(referenceScenarios)(
    "matches $name within the expected tolerances",
    ({
      inputs,
      variant,
      expectedTarget,
      expectedYears,
      expectedAlreadyReached,
    }) => {
      const variantResult = computeAllVariants(inputs)[variant];

      expectWithinPercent(
        variantResult.target,
        expectedTarget,
        TARGET_TOLERANCE_PERCENT,
      );
      expect(variantResult.yearsToReach).toBeCloseTo(expectedYears, 1);
      expect(
        Math.abs(variantResult.yearsToReach - expectedYears),
      ).toBeLessThanOrEqual(YEARS_TOLERANCE);
      expect(variantResult.alreadyReached).toBe(expectedAlreadyReached);
    },
  );
});
