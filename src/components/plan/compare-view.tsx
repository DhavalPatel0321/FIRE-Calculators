"use client";

import Link from "next/link";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { computeChartHorizon } from "@/components/plan/growth-chart";
import { SCENARIO_PALETTE } from "@/components/plan/scenario-palette";
import {
  compareReducer,
  initialCompareState,
} from "@/components/plan/compare-state";
import { Button } from "@/components/ui/button";
import { calculateTraditionalFire, projectPortfolio } from "@/lib/calc";
import { DEFAULT_INPUTS } from "@/lib/calc/defaults";
import type { FireInputs } from "@/lib/calc/types";
import {
  decodeCompareScenarios,
  encodeCompareScenarios,
  MAX_COMPARE_SCENARIOS,
  type CompareScenario,
} from "@/lib/url/compare";
import { decodeScenario, encodeScenario } from "@/lib/url/scenario";
import { useScenarioStore } from "@/store/scenario";

const URL_DEBOUNCE_MS = 150;
const COMPARE_PATHNAME = "/plan/compare";
const PLAN_PATHNAME = "/plan";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

type ChartPoint = { age: number } & Record<string, number>;

// Stitch each scenario's projection into a single rows-by-age dataset so
// Recharts can render N overlaid Areas off the same x axis.
function buildOverlay(scenarios: CompareScenario[]): {
  data: ChartPoint[];
  startAge: number;
  endAge: number;
} {
  if (scenarios.length === 0) {
    return { data: [], startAge: 0, endAge: 0 };
  }

  const projections = scenarios.map((scenario) => {
    const horizon = computeChartHorizon(scenario.inputs);
    return {
      id: scenario.id,
      points: projectPortfolio(scenario.inputs, horizon),
    };
  });

  const startAge = Math.min(
    ...projections.map((p) => p.points[0].age),
  );
  const endAge = Math.max(
    ...projections.map((p) => p.points[p.points.length - 1].age),
  );

  const rows: ChartPoint[] = [];
  for (let age = startAge; age <= endAge; age += 1) {
    const row: ChartPoint = { age };
    for (const projection of projections) {
      const match = projection.points.find((point) => point.age === age);
      if (match) row[projection.id] = match.portfolio;
    }
    rows.push(row);
  }

  return { data: rows, startAge, endAge };
}

function ScenarioCard({
  scenario,
  index,
  onRemove,
}: {
  scenario: CompareScenario;
  index: number;
  onRemove: (id: string) => void;
}) {
  const palette = SCENARIO_PALETTE[index];
  const traditional = useMemo(
    () => calculateTraditionalFire(scenario.inputs),
    [scenario.inputs],
  );
  return (
    <div
      data-testid={`compare-scenario-card-${index + 1}`}
      className="relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={`inline-block size-2.5 rounded-full ${palette.swatchClass}`}
          />
          <span className="text-sm font-semibold text-slate-900">
            {scenario.label}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          data-testid={`compare-remove-${scenario.id}`}
          onClick={() => onRemove(scenario.id)}
        >
          Remove
        </Button>
      </div>
      <dl className="grid grid-cols-2 gap-y-1 text-xs text-slate-600 tabular-nums">
        <dt>Current age</dt>
        <dd className="text-right">{scenario.inputs.currentAge}</dd>
        <dt>Annual contribution</dt>
        <dd className="text-right">
          {currencyFormatter.format(scenario.inputs.annualContribution)}
        </dd>
        <dt>Safe withdrawal</dt>
        <dd className="text-right">
          {(scenario.inputs.safeWithdrawalRate * 100).toFixed(1)}%
        </dd>
        <dt>Traditional FIRE</dt>
        <dd className="text-right font-semibold text-slate-900">
          {currencyFormatter.format(Math.round(traditional.target))}
        </dd>
      </dl>
    </div>
  );
}

function plannerHrefForInputs(inputs: FireInputs): string {
  const params = encodeScenario(inputs);
  const search = params.toString();
  return `${PLAN_PATHNAME}${search ? `?${search}` : ""}`;
}

export function CompareView() {
  const plannerInputs = useScenarioStore((state) => state.inputs);
  const [state, dispatch] = useReducer(compareReducer, initialCompareState);
  const hydratedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  // Hydrate once from window.location.search on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const initial = decodeCompareScenarios(params);
    if (initial.length > 0) {
      dispatch({ type: "hydrate", scenarios: initial });
    } else {
      const plannerInputs = decodeScenario(params);
      if (Object.keys(plannerInputs).length > 0) {
        dispatch({
          type: "hydrate",
          scenarios: [
            {
              id: "s1",
              label: "Current planner",
              inputs: { ...DEFAULT_INPUTS, ...plannerInputs },
            },
          ],
        });
      }
    }
    hydratedRef.current = true;
    setHasMounted(true);
  }, []);

  // Debounced URL sync after hydration.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hydratedRef.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const params = encodeCompareScenarios(state.scenarios);
      const search = params.toString();
      const next = `${COMPARE_PATHNAME}${search ? `?${search}` : ""}${window.location.hash}`;
      window.history.replaceState(window.history.state, "", next);
    }, URL_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state.scenarios]);

  const overlay = useMemo(() => buildOverlay(state.scenarios), [state.scenarios]);

  const handleAddFromPlanner = (inputs: FireInputs) => {
    dispatch({ type: "add", inputs });
  };

  const isFull = state.scenarios.length >= MAX_COMPARE_SCENARIOS;
  const editHref =
    state.scenarios.length > 0
      ? plannerHrefForInputs(state.scenarios[0].inputs)
      : PLAN_PATHNAME;

  return (
    <main
      data-testid="compare-page"
      className="px-6 py-12 text-slate-900"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Compare
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Side-by-side scenarios
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            Save up to {MAX_COMPARE_SCENARIOS} scenarios and overlay their
            portfolio trajectories. Compare states share through the URL — no
            account needed.
          </p>
        </header>

        <section
          data-testid="compare-scenarios"
          aria-label="Saved scenarios"
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">
              Scenarios ({state.scenarios.length}/{MAX_COMPARE_SCENARIOS})
            </h2>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="default"
                size="sm"
                data-testid="compare-add-from-planner"
                disabled={isFull}
                onClick={() => handleAddFromPlanner(plannerInputs)}
              >
                Add current planner scenario
              </Button>
              <Link
                href={editHref}
                data-testid="compare-edit-link"
                className="text-xs font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                Edit first scenario on /plan →
              </Link>
            </div>
          </div>

          {state.scenarios.length === 0 ? (
            <p
              data-testid="compare-empty"
              className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500"
            >
              No scenarios yet. Tweak inputs on{" "}
              <Link href="/plan" className="font-medium text-slate-700 underline">
                /plan
              </Link>{" "}
              and click &ldquo;Add current planner scenario&rdquo; to start.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {state.scenarios.map((scenario, index) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  index={index}
                  onRemove={(id) => dispatch({ type: "remove", id })}
                />
              ))}
            </div>
          )}
        </section>

        <section
          data-testid="compare-chart"
          aria-label="Overlaid portfolio trajectories"
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Portfolio overlay</h2>
              <p className="text-xs text-slate-500">
                Real-dollar balance for each scenario along its own retirement
                horizon.
              </p>
            </div>
          </div>
          <div
            className="h-72 w-full"
            role={hasMounted && state.scenarios.length > 0 ? "img" : undefined}
            aria-label={
              hasMounted && state.scenarios.length > 0
                ? "Overlaid portfolio balances by age for saved scenarios"
                : undefined
            }
          >
            {hasMounted && state.scenarios.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={overlay.data}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <defs>
                    {state.scenarios.map((scenario, index) => (
                      <linearGradient
                        key={scenario.id}
                        id={`compareFill-${scenario.id}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={SCENARIO_PALETTE[index].hex}
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="100%"
                          stopColor={SCENARIO_PALETTE[index].hex}
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="age"
                    type="number"
                    domain={[overlay.startAge, overlay.endAge]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(value: number) => `${value}`}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(value: number) =>
                      compactCurrencyFormatter.format(value)
                    }
                    width={64}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      currencyFormatter.format(
                        Math.round(Number(value ?? 0)),
                      ),
                      labelForId(state.scenarios, String(name)),
                    ]}
                    labelFormatter={(age) => `Age ${String(age)}`}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                    }}
                  />
                  <Legend
                    formatter={(value) =>
                      labelForId(state.scenarios, String(value))
                    }
                  />
                  {state.scenarios.map((scenario, index) => (
                    <Area
                      key={scenario.id}
                      type="monotone"
                      dataKey={scenario.id}
                      stroke={SCENARIO_PALETTE[index].hex}
                      strokeWidth={2}
                      fill={`url(#compareFill-${scenario.id})`}
                      connectNulls
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div
                data-testid="compare-chart-empty"
                className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500"
              >
                Add a scenario to see the overlay.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function labelForId(scenarios: CompareScenario[], id: string): string {
  const match = scenarios.find((s) => s.id === id);
  return match?.label ?? id;
}

// Re-export so /plan/compare can pick a scenario seed straight off the URL
// without coupling the page server component to the rest of the calc layer.
export { decodeScenario };
