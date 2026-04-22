import { describe, expectTypeOf, it } from "vitest";

import type { FireInputs, FireResult, FireVariant } from "@/lib/calc/types";

describe("calc types", () => {
  it("keeps FireInputs aligned with the shared PRD contract", () => {
    expectTypeOf<FireInputs>().toMatchTypeOf<{
      currentAge: number;
      targetRetirementAge: number;
      currentInvested: number;
      annualContribution: number;
      annualExpenses: number;
      partTimeIncome: number;
      expectedRealReturn: number;
      inflationRate: number;
      safeWithdrawalRate: number;
      leanExpenses?: number;
      fatExpenses?: number;
    }>();
  });

  it("constrains supported FIRE variants and result fields", () => {
    expectTypeOf<FireVariant>().toEqualTypeOf<
      "traditional" | "coast" | "barista" | "lean" | "fat"
    >();
    expectTypeOf<FireResult>().toMatchTypeOf<{
      target: number;
      yearsToReach: number;
      alreadyReached: boolean;
      variant: FireVariant;
    }>();
  });
});
