import type { FireInputs, ProjectionPoint } from "@/lib/calc/types";

// Project one end-of-year balance per year. Contributions stop once retirement begins.
export function projectPortfolio(
  inputs: FireInputs,
  years: number,
): ProjectionPoint[] {
  const projection: ProjectionPoint[] = [
    {
      age: inputs.currentAge,
      year: 0,
      portfolio: inputs.currentInvested,
    },
  ];

  let portfolioBalance = inputs.currentInvested;

  for (let year = 1; year <= years; year += 1) {
    const ageAtStartOfYear = inputs.currentAge + year - 1;
    const annualContribution =
      ageAtStartOfYear < inputs.targetRetirementAge
        ? inputs.annualContribution
        : 0;

    portfolioBalance =
      portfolioBalance * (1 + inputs.expectedRealReturn) + annualContribution;

    projection.push({
      age: inputs.currentAge + year,
      year,
      portfolio: portfolioBalance,
    });
  }

  return projection;
}
