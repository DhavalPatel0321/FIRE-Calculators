import { yearsToReachTarget } from "@/lib/calc/solver";
import type { FireInputs, FireResult } from "@/lib/calc/types";

export function calculateBaristaFire(inputs: FireInputs): FireResult {
  const retirementIncomeGap = Math.max(
    0,
    inputs.annualExpenses - inputs.partTimeIncome,
  );
  const target = retirementIncomeGap / inputs.safeWithdrawalRate;
  const alreadyReached = inputs.currentInvested >= target;

  return {
    target,
    yearsToReach: yearsToReachTarget({
      V0: inputs.currentInvested,
      C: inputs.annualContribution,
      r: inputs.expectedRealReturn,
      target,
    }),
    alreadyReached,
    variant: "barista",
  };
}
