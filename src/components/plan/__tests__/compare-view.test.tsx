import type { PropsWithChildren } from "react";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CompareView } from "@/components/plan/compare-view";
import { useScenarioStore } from "@/store/scenario";

// Same Recharts mock pattern used in growth-chart tests — jsdom has zero
// layout, so ResponsiveContainer needs a sized child or it renders nothing.
vi.mock("recharts", async () => {
  const actual =
    await vi.importActual<typeof import("recharts")>("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: PropsWithChildren) => (
      <div style={{ width: 800, height: 320 }}>{children}</div>
    ),
  };
});

const URL_DEBOUNCE_MS = 150;

function setSearch(search: string) {
  window.history.replaceState({}, "", `/plan/compare${search}`);
}

describe("<CompareView />", () => {
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

  it("starts with the empty state when the URL has no scenarios", () => {
    render(<CompareView />);
    expect(screen.getByTestId("compare-empty")).toBeInTheDocument();
    expect(screen.queryByTestId("compare-scenario-card-1")).toBeNull();
  });

  it("seeds a scenario from the live planner store on click", () => {
    act(() => {
      useScenarioStore.getState().setInput("currentAge", 33);
      useScenarioStore.getState().setInput("annualContribution", 45_000);
    });
    render(<CompareView />);
    fireEvent.click(screen.getByTestId("compare-add-from-planner"));
    const card = screen.getByTestId("compare-scenario-card-1");
    expect(card).toHaveTextContent("Scenario 1");
    expect(card).toHaveTextContent("33");
    expect(card).toHaveTextContent("$45,000");
  });

  it("caps the scenario list at three", () => {
    render(<CompareView />);
    const button = screen.getByTestId(
      "compare-add-from-planner",
    ) as HTMLButtonElement;
    for (let i = 0; i < 5; i += 1) {
      if (button.disabled) break;
      fireEvent.click(button);
    }
    expect(screen.getByTestId("compare-scenario-card-3")).toBeInTheDocument();
    expect(screen.queryByTestId("compare-scenario-card-4")).toBeNull();
    expect(button).toBeDisabled();
  });

  it("re-keys remaining scenarios after a removal", () => {
    render(<CompareView />);
    fireEvent.click(screen.getByTestId("compare-add-from-planner"));
    fireEvent.click(screen.getByTestId("compare-add-from-planner"));
    fireEvent.click(screen.getByTestId("compare-add-from-planner"));
    expect(screen.getByTestId("compare-scenario-card-3")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("compare-remove-s2"));
    // After removing slot 2, slot 3's card moves into slot 2 and there's no
    // card-3 anymore.
    expect(screen.getByTestId("compare-scenario-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("compare-scenario-card-2")).toBeInTheDocument();
    expect(screen.queryByTestId("compare-scenario-card-3")).toBeNull();
    expect(screen.queryByTestId("compare-remove-s3")).toBeNull();
  });

  it("hydrates scenarios from the URL on mount", () => {
    setSearch("?s1.currentAge=40&s2.currentAge=50&s2.label=Late+saver");
    render(<CompareView />);
    expect(screen.getByTestId("compare-scenario-card-1")).toHaveTextContent("40");
    const second = screen.getByTestId("compare-scenario-card-2");
    expect(second).toHaveTextContent("Late saver");
    expect(second).toHaveTextContent("50");
  });

  it("hydrates one scenario from unprefixed planner params for direct tab use", () => {
    setSearch("?currentAge=44&annualContribution=60000");
    render(<CompareView />);
    const card = screen.getByTestId("compare-scenario-card-1");
    expect(card).toHaveTextContent("Current planner");
    expect(card).toHaveTextContent("44");
    expect(card).toHaveTextContent("$60,000");
  });

  it("links back to /plan with the first scenario inputs", () => {
    setSearch("?s1.currentAge=40&s1.annualContribution=45000");
    render(<CompareView />);
    const href = screen.getByTestId("compare-edit-link").getAttribute("href");
    expect(href).toContain("/plan?");
    expect(href).toContain("currentAge=40");
    expect(href).toContain("annualContribution=45000");
  });

  it("debounces URL replaceState after a scenario is added", () => {
    render(<CompareView />);
    const replaceSpy = vi.spyOn(window.history, "replaceState");
    fireEvent.click(screen.getByTestId("compare-add-from-planner"));
    expect(replaceSpy).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(URL_DEBOUNCE_MS);
    });
    // DEFAULT_INPUTS produces no fields and no custom label, so the URL ends
    // up as a clean /plan/compare with no query string. The call still fires.
    expect(replaceSpy).toHaveBeenCalled();
  });
});
