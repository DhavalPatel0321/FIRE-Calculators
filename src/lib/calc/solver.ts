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
  { V0, C, r, target }: YearsToReachTargetInputs,
) {
  const growthFactor = (1 + r) ** years;

  return V0 * growthFactor + C * ((growthFactor - 1) / r) - target;
}

function futureValueDerivative(
  years: number,
  { V0, C, r }: Omit<YearsToReachTargetInputs, "target">,
) {
  const growthFactor = (1 + r) ** years;

  return Math.log(1 + r) * growthFactor * (V0 + C / r);
}

function bisectYears(inputs: YearsToReachTargetInputs) {
  let low = LOWER_BOUND;
  let high = UPPER_BOUND;
  let mid = INITIAL_GUESS;
  let lowValue = futureValueDifference(low, inputs);

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration += 1) {
    mid = (low + high) / 2;

    const midValue = futureValueDifference(mid, inputs);

    if (Math.abs(midValue) < TOLERANCE) {
      return mid;
    }

    if (lowValue * midValue <= 0) {
      high = mid;
    } else {
      low = mid;
      lowValue = midValue;
    }
  }

  return mid;
}

export function yearsToReachTarget(inputs: YearsToReachTargetInputs) {
  const { V0, C, r, target } = inputs;

  if (V0 >= target) {
    return 0;
  }

  if (r === 0) {
    if (C <= 0) {
      return Number.POSITIVE_INFINITY;
    }

    return (target - V0) / C;
  }

  if (C === 0 && V0 < target) {
    if (V0 <= 0) {
      return Number.POSITIVE_INFINITY;
    }

    return Math.log(target / V0) / Math.log(1 + r);
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
