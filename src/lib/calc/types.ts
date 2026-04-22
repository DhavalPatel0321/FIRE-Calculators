export type FireVariant =
  | "traditional"
  | "coast"
  | "barista"
  | "lean"
  | "fat";

export type FireInputs = {
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
};

export type FireResult = {
  target: number;
  yearsToReach: number;
  alreadyReached: boolean;
  variant: FireVariant;
};

export type SwrPreset = {
  safeWithdrawalRate: number;
  portfolioMultiple: number;
  label: string;
  rationale: string;
  source: string;
  isDefault?: boolean;
};
