type YearsToReachTargetInputs = {
  V0: number;
  C: number;
  r: number;
  target: number;
};

const MAX_ITERATIONS = 50;
const TOLERANCE = 0.01;
const LOWER_BOUND = 0;
const UPPER_BOUND = 100;
const INITIAL_GUESS = 10;

function futureValueDifference(
  years: number,
  {
    V0: currentInvested,
    C: annualContribution,
    r: expectedRealReturn,
    target,
  }: YearsToReachTargetInputs,
) {
  const growthFactor = (1 + expectedRealReturn) ** years;

  return (
    currentInvested * growthFactor +
    annualContribution * ((growthFactor - 1) / expectedRealReturn) -
    target
  );
}

function futureValueDerivative(
  years: number,
  {
    V0: currentInvested,
    C: annualContribution,
    r: expectedRealReturn,
  }: Omit<YearsToReachTargetInputs, "target">,
) {
  const growthFactor = (1 + expectedRealReturn) ** years;

  return (
    Math.log(1 + expectedRealReturn) *
    growthFactor *
    (currentInvested + annualContribution / expectedRealReturn)
  );
}

function bisectYears(inputs: YearsToReachTargetInputs) {
  let lowerBound = LOWER_BOUND;
  let upperBound = UPPER_BOUND;
  let midpoint = INITIAL_GUESS;
  let lowerBoundDifference = futureValueDifference(lowerBound, inputs);

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration += 1) {
    midpoint = (lowerBound + upperBound) / 2;

    const midpointDifference = futureValueDifference(midpoint, inputs);

    if (Math.abs(midpointDifference) < TOLERANCE) {
      return midpoint;
    }

    if (lowerBoundDifference * midpointDifference <= 0) {
      upperBound = midpoint;
    } else {
      lowerBound = midpoint;
      lowerBoundDifference = midpointDifference;
    }
  }

  return midpoint;
}

export function yearsToReachTarget(inputs: YearsToReachTargetInputs) {
  const {
    V0: currentInvested,
    C: annualContribution,
    r: expectedRealReturn,
    target,
  } = inputs;

  if (currentInvested >= target) {
    return 0;
  }

  if (expectedRealReturn === 0) {
    if (annualContribution <= 0) {
      return Number.POSITIVE_INFINITY;
    }

    return (target - currentInvested) / annualContribution;
  }

  if (annualContribution === 0 && currentInvested < target) {
    if (currentInvested <= 0) {
      return Number.POSITIVE_INFINITY;
    }

    return Math.log(target / currentInvested) / Math.log(1 + expectedRealReturn);
  }

  let years = INITIAL_GUESS;

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration += 1) {
    const value = futureValueDifference(years, inputs);

    if (Math.abs(value) < TOLERANCE) {
      return years;
    }

    const derivative = futureValueDerivative(years, inputs);

    if (!Number.isFinite(derivative) || derivative === 0) {
      break;
    }

    const nextYears = years - value / derivative;

    if (
      !Number.isFinite(nextYears) ||
      nextYears < LOWER_BOUND ||
      nextYears > UPPER_BOUND
    ) {
      break;
    }

    years = nextYears;
  }

  return bisectYears(inputs);
}
