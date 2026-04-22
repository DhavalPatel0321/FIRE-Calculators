import type { PropsWithChildren } from "react";

import { act, cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { computeChartHorizon, GrowthChart } from "@/components/plan/growth-chart";
import { VARIANT_ORDER } from "@/components/plan/variant-theme";
import { DEFAULT_INPUTS } from "@/lib/calc/defaults";
import { projectPortfolio } from "@/lib/calc/projection";
import { useScenarioStore } from "@/store/scenario";

// jsdom has zero layout; Recharts' ResponsiveContainer measures DOM dims and
// renders nothing when they're 0. Mock it to pass children through a sized div
// so the chart actually mounts under tests.
vi.mock("recharts", async () => {
  const actual =
    await vi.importActual<typeof import("recharts")>("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: PropsWithChildren) => (
      <div style={{ width: 800, height: 300 }}>{children}</div>
    ),
  };
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

describe("computeChartHorizon", () => {
  it("uses the years-to-retirement span when that is at least 30", () => {
    expect(computeChartHorizon(DEFAULT_INPUTS)).toBe(35);
  });

  it("pads short spans up to the 30-year minimum", () => {
    expect(
      computeChartHorizon({
        ...DEFAULT_INPUTS,
        currentAge: 55,
        targetRetirementAge: 60,
      }),
    ).toBe(30);
  });

  it("treats already-past retirement ages as zero span and pads to 30", () => {
    expect(
      computeChartHorizon({
        ...DEFAULT_INPUTS,
        currentAge: 70,
        targetRetirementAge: 65,
      }),
    ).toBe(30);
  });
});

describe("<GrowthChart />", () => {
  beforeEach(() => {
    useScenarioStore.getState().resetInputs();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the chart, legend, and five variant legend entries", () => {
    render(<GrowthChart />);
    expect(screen.getByTestId("growth-chart")).toBeInTheDocument();
    const legend = screen.getByTestId("growth-chart-legend");
    expect(within(legend).getByText("Portfolio")).toBeInTheDocument();
    for (const variant of VARIANT_ORDER) {
      expect(
        within(legend).getByTestId(`growth-chart-legend-${variant}`),
      ).toBeInTheDocument();
    }
  });

  it("shows the final projected balance for DEFAULT_INPUTS", () => {
    const projection = projectPortfolio(DEFAULT_INPUTS, 35);
    const expected = currencyFormatter.format(
      Math.round(projection[projection.length - 1].portfolio),
    );
    render(<GrowthChart />);
    expect(screen.getByTestId("growth-chart-end-balance")).toHaveTextContent(
      expected,
    );
  });

  it("recomputes the end balance when expectedRealReturn changes", () => {
    render(<GrowthChart />);
    const before = screen
      .getByTestId("growth-chart-end-balance")
      .textContent?.trim();
    act(() => {
      useScenarioStore.getState().setInput("expectedRealReturn", 0.04);
    });
    const after = screen
      .getByTestId("growth-chart-end-balance")
      .textContent?.trim();
    expect(after).not.toEqual(before);
  });

  it("still renders when the user is already past their FIRE target", () => {
    act(() => {
      useScenarioStore.getState().setInput("currentInvested", 5_000_000);
    });
    render(<GrowthChart />);
    expect(screen.getByTestId("growth-chart")).toBeInTheDocument();
    expect(
      screen.getByTestId("growth-chart-end-balance"),
    ).toBeInTheDocument();
  });
});
