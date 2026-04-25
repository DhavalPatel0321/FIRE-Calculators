import { describe, expect, it } from "vitest";

import {
  compareReducer,
  initialCompareState,
} from "@/components/plan/compare-state";
import { DEFAULT_INPUTS } from "@/lib/calc/defaults";
import { MAX_COMPARE_SCENARIOS } from "@/lib/url/compare";

describe("compareReducer", () => {
  it("starts empty", () => {
    expect(initialCompareState.scenarios).toEqual([]);
  });

  it("adds a scenario with an auto-generated label and slot id", () => {
    const next = compareReducer(initialCompareState, {
      type: "add",
      inputs: DEFAULT_INPUTS,
    });
    expect(next.scenarios).toHaveLength(1);
    expect(next.scenarios[0].id).toBe("s1");
    expect(next.scenarios[0].label).toBe("Scenario 1");
  });

  it("respects an explicit label when provided", () => {
    const next = compareReducer(initialCompareState, {
      type: "add",
      inputs: DEFAULT_INPUTS,
      label: "Aggressive saver",
    });
    expect(next.scenarios[0].label).toBe("Aggressive saver");
  });

  it(`caps the scenario list at ${MAX_COMPARE_SCENARIOS}`, () => {
    let state = initialCompareState;
    for (let i = 0; i < MAX_COMPARE_SCENARIOS + 2; i += 1) {
      state = compareReducer(state, { type: "add", inputs: DEFAULT_INPUTS });
    }
    expect(state.scenarios).toHaveLength(MAX_COMPARE_SCENARIOS);
  });

  it("re-keys remaining scenarios after a removal so ids stay s1..sN", () => {
    let state = compareReducer(initialCompareState, {
      type: "add",
      inputs: DEFAULT_INPUTS,
      label: "A",
    });
    state = compareReducer(state, {
      type: "add",
      inputs: DEFAULT_INPUTS,
      label: "B",
    });
    state = compareReducer(state, {
      type: "add",
      inputs: DEFAULT_INPUTS,
      label: "C",
    });
    const removed = compareReducer(state, { type: "remove", id: "s2" });
    expect(removed.scenarios.map((s) => s.id)).toEqual(["s1", "s2"]);
    expect(removed.scenarios.map((s) => s.label)).toEqual(["A", "C"]);
  });

  it("clear empties the state", () => {
    const populated = compareReducer(initialCompareState, {
      type: "add",
      inputs: DEFAULT_INPUTS,
    });
    expect(compareReducer(populated, { type: "clear" }).scenarios).toEqual([]);
  });

  it("hydrate replaces existing scenarios and clamps at the cap", () => {
    const populated = compareReducer(initialCompareState, {
      type: "add",
      inputs: DEFAULT_INPUTS,
    });
    const hydrated = compareReducer(populated, {
      type: "hydrate",
      scenarios: [
        { id: "ignored", label: "L1", inputs: DEFAULT_INPUTS },
        { id: "ignored", label: "L2", inputs: DEFAULT_INPUTS },
        { id: "ignored", label: "L3", inputs: DEFAULT_INPUTS },
        { id: "ignored", label: "L4", inputs: DEFAULT_INPUTS },
      ],
    });
    expect(hydrated.scenarios).toHaveLength(MAX_COMPARE_SCENARIOS);
    expect(hydrated.scenarios.map((s) => s.id)).toEqual(["s1", "s2", "s3"]);
    expect(hydrated.scenarios.map((s) => s.label)).toEqual(["L1", "L2", "L3"]);
  });
});
