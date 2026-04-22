import { yearsToReachTarget } from "@/lib/calc/solver";
import type { FireInputs, FireResult } from "@/lib/calc/types";

export function calculateTraditionalFire(inputs: FireInputs): FireResult {
  const target = inputs.annualExpenses / inputs.safeWithdrawalRate;
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
    variant: "traditional",
  };
}
