import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ScenarioUrlSync } from "@/components/plan/scenario-url-sync";
import { DEFAULT_INPUTS } from "@/lib/calc/defaults";
import { useScenarioStore } from "@/store/scenario";

const URL_DEBOUNCE_MS = 150;

function setSearch(search: string) {
  window.history.replaceState({}, "", `/plan${search}`);
}

describe("<ScenarioUrlSync />", () => {
  beforeEach(() => {
    useScenarioStore.getState().resetInputs();
    setSearch("");
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
    setSearch("");
  });

  it("hydrates the store from window.location.search on mount", () => {
    setSearch("?currentAge=45&safeWithdrawalRate=0.035");
    render(<ScenarioUrlSync />);
    const inputs = useScenarioStore.getState().inputs;
    expect(inputs.currentAge).toBe(45);
    expect(inputs.safeWithdrawalRate).toBe(0.035);
    expect(inputs.annualExpenses).toBe(DEFAULT_INPUTS.annualExpenses);
  });

  it("does not change inputs when no recognised params are present", () => {
    setSearch("?strategy=aggressive");
    render(<ScenarioUrlSync />);
    expect(useScenarioStore.getState().inputs).toEqual(DEFAULT_INPUTS);
  });

  it("debounces store changes into a single replaceState update", () => {
    render(<ScenarioUrlSync />);
    const replaceSpy = vi.spyOn(window.history, "replaceState");

    act(() => {
      useScenarioStore.getState().setInput("currentAge", 41);
      useScenarioStore.getState().setInput("annualContribution", 45_000);
    });

    expect(replaceSpy).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(URL_DEBOUNCE_MS);
    });

    expect(replaceSpy).toHaveBeenCalledTimes(1);
    const url = String(replaceSpy.mock.calls[0][2]);
    expect(url).toContain("currentAge=41");
    expect(url).toContain("annualContribution=45000");
  });

  it("strips fields once they're returned to defaults", () => {
    render(<ScenarioUrlSync />);
    act(() => {
      useScenarioStore.getState().setInput("currentAge", 50);
    });
    act(() => {
      vi.advanceTimersByTime(URL_DEBOUNCE_MS);
    });
    expect(window.location.search).toContain("currentAge=50");

    act(() => {
      useScenarioStore.getState().setInput("currentAge", DEFAULT_INPUTS.currentAge);
    });
    act(() => {
      vi.advanceTimersByTime(URL_DEBOUNCE_MS);
    });
    expect(window.location.search).not.toContain("currentAge");
  });
});
