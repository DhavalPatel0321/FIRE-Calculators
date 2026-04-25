import { describe, expect, it } from "vitest";

import { DEFAULT_INPUTS } from "@/lib/calc/defaults";
import type { FireInputs } from "@/lib/calc/types";
import { decodeScenario, encodeScenario } from "@/lib/url/scenario";

describe("encodeScenario", () => {
  it("emits an empty params object when inputs match DEFAULT_INPUTS", () => {
    const params = encodeScenario(DEFAULT_INPUTS);
    expect([...params.entries()]).toEqual([]);
  });

  it("only encodes fields that diverge from defaults", () => {
    const inputs: FireInputs = {
      ...DEFAULT_INPUTS,
      currentAge: 42,
      annualContribution: 50_000,
    };
    const params = encodeScenario(inputs);
    expect(params.get("currentAge")).toBe("42");
    expect(params.get("annualContribution")).toBe("50000");
    expect(params.has("annualExpenses")).toBe(false);
    expect(params.has("safeWithdrawalRate")).toBe(false);
  });

  it("preserves fractional rate values", () => {
    const inputs: FireInputs = {
      ...DEFAULT_INPUTS,
      safeWithdrawalRate: 0.035,
      expectedRealReturn: 0.06,
    };
    const params = encodeScenario(inputs);
    expect(params.get("safeWithdrawalRate")).toBe("0.035");
    expect(params.get("expectedRealReturn")).toBe("0.06");
  });

  it("skips undefined and non-finite numeric fields", () => {
    const inputs: FireInputs = {
      ...DEFAULT_INPUTS,
      leanExpenses: undefined,
      fatExpenses: Number.NaN,
    };
    const params = encodeScenario(inputs);
    expect(params.has("leanExpenses")).toBe(false);
    expect(params.has("fatExpenses")).toBe(false);
  });
});

describe("decodeScenario", () => {
  it("returns an empty object for an empty params instance", () => {
    expect(decodeScenario(new URLSearchParams())).toEqual({});
  });

  it("coerces known keys to numbers", () => {
    const params = new URLSearchParams({
      currentAge: "45",
      safeWithdrawalRate: "0.035",
    });
    expect(decodeScenario(params)).toEqual({
      currentAge: 45,
      safeWithdrawalRate: 0.035,
    });
  });

  it("drops unknown keys", () => {
    const params = new URLSearchParams({
      currentAge: "45",
      strategy: "aggressive",
    });
    expect(decodeScenario(params)).toEqual({ currentAge: 45 });
  });

  it("drops empty strings, NaN, and non-numeric values", () => {
    const params = new URLSearchParams({
      currentAge: "",
      annualContribution: "lots",
      annualExpenses: "NaN",
      currentInvested: "Infinity",
    });
    expect(decodeScenario(params)).toEqual({});
  });
});

describe("encodeScenario / decodeScenario round trip", () => {
  it("survives a realistic scenario", () => {
    const original: FireInputs = {
      ...DEFAULT_INPUTS,
      currentAge: 36,
      targetRetirementAge: 55,
      currentInvested: 280_000,
      annualContribution: 42_500,
      annualExpenses: 60_000,
      safeWithdrawalRate: 0.035,
      expectedRealReturn: 0.06,
    };
    const decoded = decodeScenario(encodeScenario(original));
    expect({ ...DEFAULT_INPUTS, ...decoded }).toEqual(original);
  });
});
