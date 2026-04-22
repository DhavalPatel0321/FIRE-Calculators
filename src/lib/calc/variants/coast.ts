import { yearsToReachTarget } from "@/lib/calc/solver";
import type { FireInputs, FireResult } from "@/lib/calc/types";

export function calculateCoastFire(inputs: FireInputs): FireResult {
  const yearsUntilRetirement =
    inputs.targetRetirementAge - inputs.currentAge;
  const target =
    inputs.annualExpenses /
    inputs.safeWithdrawalRate /
    (1 + inputs.expectedRealReturn) ** yearsUntilRetirement;
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
    variant: "coast",
  };
}
