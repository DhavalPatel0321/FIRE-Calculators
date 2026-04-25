import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  formatNumberDisplay,
  InputPanel,
  sanitizeNumberInput,
} from "@/components/plan/input-panel";
import { DEFAULT_INPUTS } from "@/lib/calc/defaults";
import { useScenarioStore } from "@/store/scenario";

describe("formatNumberDisplay", () => {
  it("inserts thousands separators for $ amounts", () => {
    expect(formatNumberDisplay(150_000)).toBe("150,000");
    expect(formatNumberDisplay(3_750_000)).toBe("3,750,000");
  });

  it("renders zero and undefined as the empty string", () => {
    expect(formatNumberDisplay(0)).toBe("");
    expect(formatNumberDisplay(undefined)).toBe("");
  });

  it("never produces leading zeros", () => {
    // Regression: previously type=number could leave "0150000" in the field
    // when the value started at 0 and the user typed digits.
    for (const value of [1, 10, 100, 1_500, 30_000, 999_999]) {
      expect(formatNumberDisplay(value).startsWith("0")).toBe(false);
    }
  });
});

describe("sanitizeNumberInput", () => {
  it("strips commas and spaces", () => {
    expect(sanitizeNumberInput("150,000")).toBe(150_000);
    expect(sanitizeNumberInput("1, 500")).toBe(1_500);
  });

  it("strips leading zeros via numeric coercion", () => {
    expect(sanitizeNumberInput("030")).toBe(30);
    expect(sanitizeNumberInput("000150000")).toBe(150_000);
  });

  it("returns null for empty / non-numeric input", () => {
    expect(sanitizeNumberInput("")).toBeNull();
    expect(sanitizeNumberInput("abc")).toBeNull();
    expect(sanitizeNumberInput(",,,")).toBeNull();
  });
});

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
    ).toBe("30");
    expect(
      (screen.getByTestId("input-currentInvested") as HTMLInputElement).value,
    ).toBe("150,000");
    expect(screen.getByTestId("slider-value-expectedRealReturn")).toHaveTextContent(
      "7.0%",
    );
    expect(screen.getByTestId("slider-value-safeWithdrawalRate")).toHaveTextContent(
      "4.0%",
    );
  });

  it("displays $ amounts with comma separators", () => {
    render(<InputPanel />);
    expect(
      (screen.getByTestId("input-annualContribution") as HTMLInputElement).value,
    ).toBe("30,000");
    expect(
      (screen.getByTestId("input-annualExpenses") as HTMLInputElement).value,
    ).toBe("40,000");
  });

  it("accepts comma-separated input and writes a clean integer to the store", () => {
    render(<InputPanel />);
    const field = screen.getByTestId("input-currentInvested");
    fireEvent.focus(field);
    fireEvent.change(field, { target: { value: "1,250,000" } });
    expect(useScenarioStore.getState().inputs.currentInvested).toBe(1_250_000);
  });

  it("strips leading zeros when the field loses focus", () => {
    render(<InputPanel />);
    const field = screen.getByTestId("input-currentAge") as HTMLInputElement;
    fireEvent.focus(field);
    fireEvent.change(field, { target: { value: "045" } });
    fireEvent.blur(field);
    expect(useScenarioStore.getState().inputs.currentAge).toBe(45);
    expect(field.value).toBe("45");
  });

  it("never displays a leading zero when re-rendered after typing 0XXX", () => {
    // Regression: a value of 0 in the store + user typing digits could leave
    // a leading zero visible. The field should always reformat on blur.
    render(<InputPanel />);
    const field = screen.getByTestId("partTimeIncome".replace(/^/, "input-")) as HTMLInputElement;
    fireEvent.focus(field);
    fireEvent.change(field, { target: { value: "" } });
    fireEvent.change(field, { target: { value: "5" } });
    fireEvent.blur(field);
    expect(field.value).toBe("5");
    expect(field.value.startsWith("0")).toBe(false);
  });

  it("treats an empty input as zero in the store but renders blank in the field", () => {
    render(<InputPanel />);
    const field = screen.getByTestId("input-annualContribution") as HTMLInputElement;
    fireEvent.focus(field);
    fireEvent.change(field, { target: { value: "" } });
    fireEvent.blur(field);
    expect(useScenarioStore.getState().inputs.annualContribution).toBe(0);
    expect(field.value).toBe("");
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
