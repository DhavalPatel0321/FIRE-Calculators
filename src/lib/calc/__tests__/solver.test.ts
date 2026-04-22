import { describe, expect, it } from "vitest";

import { yearsToReachTarget } from "@/lib/calc/solver";

function portfolioValueAtYears(
  years: number,
  { V0, C, r }: { V0: number; C: number; r: number },
) {
  const growthFactor = (1 + r) ** years;

  return V0 * growthFactor + C * ((growthFactor - 1) / r);
}

describe("yearsToReachTarget", () => {
  it("returns 0 when the target is already reached", () => {
    expect(
      yearsToReachTarget({
        V0: 1_000_000,
        C: 20_000,
        r: 0.07,
        target: 800_000,
      }),
    ).toBe(0);
  });

  it("uses the linear solution when real return is zero", () => {
    expect(
      yearsToReachTarget({
        V0: 200_000,
        C: 5_000,
        r: 0,
        target: 1_500_000,
      }),
    ).toBe(260);
  });

  it("uses the closed-form compounding solution when contributions are zero", () => {
    const result = yearsToReachTarget({
      V0: 100_000,
      C: 0,
      r: 0.07,
      target: 200_000,
    });

    expect(result).toBeCloseTo(
      Math.log(2) / Math.log(1.07),
      10,
    );
  });

  it("solves a standard accumulation case", () => {
    const inputs = {
      V0: 50_000,
      C: 20_000,
      r: 0.07,
      target: 1_000_000,
    };
    const result = yearsToReachTarget(inputs);

    expect(portfolioValueAtYears(result, inputs)).toBeCloseTo(inputs.target, 2);
  });
});
