import { describe, expect, it } from "vitest";

import { DEFAULT_INPUTS } from "@/lib/calc/defaults";
import type { FireInputs } from "@/lib/calc/types";
import {
  decodeCompareScenarios,
  defaultLabelForIndex,
  encodeCompareScenarios,
  MAX_COMPARE_SCENARIOS,
  type CompareScenario,
} from "@/lib/url/compare";

const inputs = (overrides: Partial<FireInputs> = {}): FireInputs => ({
  ...DEFAULT_INPUTS,
  ...overrides,
});

describe("encodeCompareScenarios", () => {
  it("emits per-slot keys prefixed with sN.", () => {
    const params = encodeCompareScenarios([
      { id: "s1", label: defaultLabelForIndex(0), inputs: inputs({ currentAge: 32 }) },
      { id: "s2", label: defaultLabelForIndex(1), inputs: inputs({ annualContribution: 50_000 }) },
    ]);
    expect(params.get("s1.currentAge")).toBe("32");
    expect(params.get("s2.annualContribution")).toBe("50000");
    expect(params.has("s3.currentAge")).toBe(false);
  });

  it("omits fields equal to DEFAULT_INPUTS", () => {
    const params = encodeCompareScenarios([
      { id: "s1", label: defaultLabelForIndex(0), inputs: inputs() },
    ]);
    expect([...params.entries()]).toEqual([]);
  });

  it("only emits a label when it diverges from the auto-generated default", () => {
    const params = encodeCompareScenarios([
      { id: "s1", label: defaultLabelForIndex(0), inputs: inputs({ currentAge: 40 }) },
      { id: "s2", label: "My early retirement", inputs: inputs({ currentAge: 41 }) },
    ]);
    expect(params.has("s1.label")).toBe(false);
    expect(params.get("s2.label")).toBe("My early retirement");
  });

  it("caps emitted scenarios at MAX_COMPARE_SCENARIOS", () => {
    // Each slot diverges from DEFAULT_INPUTS so it actually emits something.
    const overflow: CompareScenario[] = Array.from({ length: 5 }, (_, i) => ({
      id: `s${i + 1}`,
      label: defaultLabelForIndex(i),
      inputs: inputs({ currentAge: 31 + i }),
    }));
    const params = encodeCompareScenarios(overflow);
    for (let i = 0; i < MAX_COMPARE_SCENARIOS; i += 1) {
      expect(params.get(`s${i + 1}.currentAge`)).toBe(String(31 + i));
    }
    expect(params.has("s4.currentAge")).toBe(false);
    expect(params.has("s5.currentAge")).toBe(false);
  });
});

describe("decodeCompareScenarios", () => {
  it("returns an empty array when no slots are present", () => {
    expect(decodeCompareScenarios(new URLSearchParams())).toEqual([]);
  });

  it("hydrates scenarios from per-slot params, preserving slot order", () => {
    const params = new URLSearchParams({
      "s2.currentAge": "41",
      "s1.currentAge": "32",
      "s1.label": "Aggressive",
    });
    const scenarios = decodeCompareScenarios(params);
    expect(scenarios.map((s) => s.id)).toEqual(["s1", "s2"]);
    expect(scenarios[0].inputs.currentAge).toBe(32);
    expect(scenarios[0].label).toBe("Aggressive");
    expect(scenarios[1].inputs.currentAge).toBe(41);
    expect(scenarios[1].label).toBe(defaultLabelForIndex(1));
  });

  it("drops malformed slot prefixes and unknown inner keys", () => {
    const params = new URLSearchParams({
      "s4.currentAge": "55",
      "noslotcurrentAge": "30",
      "s1.strategy": "aggressive",
      "s1.currentAge": "33",
    });
    const scenarios = decodeCompareScenarios(params);
    expect(scenarios).toHaveLength(1);
    expect(scenarios[0].inputs.currentAge).toBe(33);
  });
});

describe("encode / decode round trip", () => {
  it("survives three custom-labelled scenarios", () => {
    const original: CompareScenario[] = [
      {
        id: "s1",
        label: "Conservative",
        inputs: inputs({ currentAge: 35, expectedRealReturn: 0.05 }),
      },
      {
        id: "s2",
        label: defaultLabelForIndex(1),
        inputs: inputs({ currentAge: 40, annualContribution: 60_000 }),
      },
      {
        id: "s3",
        label: "Lean retirement",
        inputs: inputs({ annualExpenses: 25_000, leanExpenses: 25_000 }),
      },
    ];

    const decoded = decodeCompareScenarios(encodeCompareScenarios(original));
    expect(decoded).toHaveLength(3);
    decoded.forEach((scenario, index) => {
      expect(scenario.id).toBe(original[index].id);
      expect(scenario.label).toBe(original[index].label);
      expect(scenario.inputs).toEqual(original[index].inputs);
    });
  });
});
