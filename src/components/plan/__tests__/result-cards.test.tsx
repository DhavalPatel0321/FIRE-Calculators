import { act, cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ResultCards } from "@/components/plan/result-cards";
import { VARIANT_ORDER } from "@/components/plan/variant-theme";
import { useScenarioStore } from "@/store/scenario";

describe("<ResultCards />", () => {
  beforeEach(() => {
    useScenarioStore.getState().resetInputs();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders one card per FIRE variant in the canonical order", () => {
    render(<ResultCards />);
    const grid = screen.getByTestId("result-cards-grid");
    const cards = within(grid).getAllByTestId(/^result-card-/);
    expect(cards).toHaveLength(5);
    const renderedOrder = cards.map((card) =>
      card.getAttribute("data-testid")?.replace("result-card-", ""),
    );
    expect(renderedOrder).toEqual([...VARIANT_ORDER]);
  });

  it("formats default-input targets for each variant", () => {
    // DEFAULT_INPUTS: $40k expenses, $20k part-time, 4% SWR, $35k lean, $150k fat
    render(<ResultCards />);
    expect(screen.getByTestId("result-number-traditional")).toHaveTextContent(
      "$1,000,000",
    );
    expect(screen.getByTestId("result-number-barista")).toHaveTextContent(
      "$500,000",
    );
    expect(screen.getByTestId("result-number-lean")).toHaveTextContent(
      "$875,000",
    );
    expect(screen.getByTestId("result-number-fat")).toHaveTextContent(
      "$3,750,000",
    );
  });

  it("re-renders when the scenario store updates an input", () => {
    render(<ResultCards />);
    expect(screen.getByTestId("result-number-traditional")).toHaveTextContent(
      "$1,000,000",
    );
    act(() => {
      // 50k / 4% = 1.25M — changing annualExpenses flows into Traditional's target.
      useScenarioStore.getState().setInput("annualExpenses", 50_000);
    });
    expect(screen.getByTestId("result-number-traditional")).toHaveTextContent(
      "$1,250,000",
    );
  });

  it("renders 'Already FI' when currentInvested clears the target", () => {
    act(() => {
      useScenarioStore.getState().setInput("currentInvested", 1_000_000);
    });
    render(<ResultCards />);
    expect(
      screen.getByTestId("result-timeline-traditional"),
    ).toHaveTextContent("Already FI");
  });
});
