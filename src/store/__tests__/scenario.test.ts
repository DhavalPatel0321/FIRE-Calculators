import { beforeEach, describe, expect, it } from "vitest";

import { DEFAULT_INPUTS } from "@/lib/calc/defaults";
import { useScenarioStore } from "@/store/scenario";

describe("useScenarioStore", () => {
  beforeEach(() => {
    useScenarioStore.getState().resetInputs();
  });

  it("starts with the shared DEFAULT_INPUTS", () => {
    expect(useScenarioStore.getState().inputs).toEqual(DEFAULT_INPUTS);
  });

  it("does not share a reference with DEFAULT_INPUTS", () => {
    // Guards against callers mutating module-level defaults through the store.
    expect(useScenarioStore.getState().inputs).not.toBe(DEFAULT_INPUTS);
  });

  it("setInput updates a single numeric field", () => {
    useScenarioStore.getState().setInput("currentAge", 42);
    expect(useScenarioStore.getState().inputs.currentAge).toBe(42);
    expect(useScenarioStore.getState().inputs.targetRetirementAge).toBe(
      DEFAULT_INPUTS.targetRetirementAge,
    );
  });

  it("setInput updates rate fields without coercion", () => {
    useScenarioStore.getState().setInput("safeWithdrawalRate", 0.035);
    expect(useScenarioStore.getState().inputs.safeWithdrawalRate).toBe(0.035);
  });

  it("setInput produces a new inputs object each call", () => {
    const before = useScenarioStore.getState().inputs;
    useScenarioStore.getState().setInput("annualContribution", 45_000);
    const after = useScenarioStore.getState().inputs;
    expect(after).not.toBe(before);
  });

  it("applyInputs merges a partial into the current inputs", () => {
    const { applyInputs } = useScenarioStore.getState();
    applyInputs({ currentAge: 47, annualContribution: 55_000 });
    const inputs = useScenarioStore.getState().inputs;
    expect(inputs.currentAge).toBe(47);
    expect(inputs.annualContribution).toBe(55_000);
    expect(inputs.annualExpenses).toBe(DEFAULT_INPUTS.annualExpenses);
  });

  it("applyInputs ignores untouched fields rather than resetting them", () => {
    const { setInput, applyInputs } = useScenarioStore.getState();
    setInput("currentInvested", 250_000);
    applyInputs({ currentAge: 33 });
    expect(useScenarioStore.getState().inputs.currentInvested).toBe(250_000);
    expect(useScenarioStore.getState().inputs.currentAge).toBe(33);
  });

  it("resetInputs returns all fields to DEFAULT_INPUTS", () => {
    const { setInput, resetInputs } = useScenarioStore.getState();
    setInput("currentAge", 55);
    setInput("annualExpenses", 90_000);
    setInput("safeWithdrawalRate", 0.05);
    resetInputs();
    expect(useScenarioStore.getState().inputs).toEqual(DEFAULT_INPUTS);
  });
});
