import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { InputPanel } from "@/components/plan/input-panel";
import { DEFAULT_INPUTS } from "@/lib/calc/defaults";
import { useScenarioStore } from "@/store/scenario";

describe("<InputPanel />", () => {
  beforeEach(() => {
    useScenarioStore.getState().resetInputs();
  });

  afterEach(() => {
    cleanup();
  });

  it("seeds every visible field from the scenario store", () => {
    render(<InputPanel />);
    expect(
      (screen.getByTestId("input-currentAge") as HTMLInputElement).value,
    ).toBe(String(DEFAULT_INPUTS.currentAge));
    expect(
      (screen.getByTestId("input-currentInvested") as HTMLInputElement).value,
    ).toBe(String(DEFAULT_INPUTS.currentInvested));
    expect(screen.getByTestId("slider-value-expectedRealReturn")).toHaveTextContent(
      "7.0%",
    );
    expect(screen.getByTestId("slider-value-safeWithdrawalRate")).toHaveTextContent(
      "4.0%",
    );
  });

  it("writes number input changes back to the store", () => {
    render(<InputPanel />);
    fireEvent.change(screen.getByTestId("input-currentAge"), {
      target: { value: "42" },
    });
    expect(useScenarioStore.getState().inputs.currentAge).toBe(42);
  });

  it("treats an empty numeric input as zero", () => {
    render(<InputPanel />);
    fireEvent.change(screen.getByTestId("input-annualContribution"), {
      target: { value: "" },
    });
    expect(useScenarioStore.getState().inputs.annualContribution).toBe(0);
  });

  it("Reset button restores DEFAULT_INPUTS", () => {
    render(<InputPanel />);
    act(() => {
      useScenarioStore.getState().setInput("currentAge", 55);
      useScenarioStore.getState().setInput("annualExpenses", 90_000);
    });
    fireEvent.click(screen.getByTestId("reset-inputs"));
    expect(useScenarioStore.getState().inputs).toEqual(DEFAULT_INPUTS);
  });
});
