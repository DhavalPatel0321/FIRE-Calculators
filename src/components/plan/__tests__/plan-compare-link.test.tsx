import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { PlanCompareLink } from "@/components/plan/plan-compare-link";
import { useScenarioStore } from "@/store/scenario";

describe("<PlanCompareLink />", () => {
  beforeEach(() => {
    useScenarioStore.getState().resetInputs();
  });

  afterEach(() => {
    cleanup();
    useScenarioStore.getState().resetInputs();
  });

  it("seeds compare with the current planner inputs", () => {
    useScenarioStore.getState().setInput("currentAge", 41);
    useScenarioStore.getState().setInput("annualContribution", 55_000);

    render(<PlanCompareLink />);

    const href = screen.getByTestId("plan-compare-link").getAttribute("href");
    expect(href).toContain("/plan/compare?");
    expect(href).toContain("s1.currentAge=41");
    expect(href).toContain("s1.annualContribution=55000");
    expect(href).toContain("s1.label=Current+planner");
  });
});
