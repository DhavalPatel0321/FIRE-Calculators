import type { FireInputs } from "@/lib/calc/types";

export const DEFAULT_INPUTS: FireInputs = {
  currentAge: 30,
  targetRetirementAge: 65,
  currentInvested: 150_000,
  annualContribution: 30_000,
  annualExpenses: 40_000,
  partTimeIncome: 20_000,
  expectedRealReturn: 0.07,
  inflationRate: 0.03,
  safeWithdrawalRate: 0.04,
  leanExpenses: 35_000,
  fatExpenses: 150_000,
};
