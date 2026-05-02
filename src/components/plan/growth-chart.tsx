"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { computeAllVariants, projectPortfolio } from "@/lib/calc";
import type { FireInputs, FireVariant } from "@/lib/calc/types";
import { useScenarioStore } from "@/store/scenario";

import { VARIANT_ORDER, VARIANT_THEME } from "./variant-theme";

type VariantVisibility = Record<FireVariant, boolean>;

const ALL_VARIANTS_VISIBLE: VariantVisibility = VARIANT_ORDER.reduce(
  (acc, variant) => ({ ...acc, [variant]: true }),
  {} as VariantVisibility,
);

const MIN_HORIZON_YEARS = 30;
const PORTFOLIO_STROKE = VARIANT_THEME.traditional.accentHex;

// Keep variant labels inside the plot area so long names ("Traditional", "Barista")
// can't be clipped by the SVG right edge.
export const REFERENCE_LABEL_POSITION = "insideTopRight" as const;

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

export function computeChartHorizon(inputs: FireInputs): number {
  const ageSpan = Math.max(
    inputs.targetRetirementAge - inputs.currentAge,
    0,
  );
  return Math.max(ageSpan, MIN_HORIZON_YEARS);
}

export function GrowthChart() {
  const inputs = useScenarioStore((state) => state.inputs);

  const horizonYears = useMemo(() => computeChartHorizon(inputs), [inputs]);
  const series = useMemo(
    () => projectPortfolio(inputs, horizonYears),
    [inputs, horizonYears],
  );
  const variants = useMemo(() => computeAllVariants(inputs), [inputs]);

  const [visibility, setVisibility] = useState<VariantVisibility>(
    ALL_VARIANTS_VISIBLE,
  );
  const toggleVariant = (variant: FireVariant) =>
    setVisibility((previous) => ({
      ...previous,
      [variant]: !previous[variant],
    }));

  const lastPoint = series[series.length - 1];

  return (
    <div data-testid="growth-chart" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Portfolio growth</h2>
          <p className="text-xs text-slate-500">
            Real-dollar balance; contributions stop at your target retirement
            age.
          </p>
        </div>
        <div className="text-right text-xs text-slate-500 tabular-nums">
          <div>
            At age {lastPoint.age}
            {": "}
            <span
              data-testid="growth-chart-end-balance"
              className="font-semibold text-slate-900"
            >
              {currencyFormatter.format(Math.round(lastPoint.portfolio))}
            </span>
          </div>
        </div>
      </div>

      <div
        className="h-64 w-full"
        role="img"
        aria-label="Projected portfolio balance by age with FIRE target reference lines"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={series}
            margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
          >
            <defs>
              <linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={PORTFOLIO_STROKE}
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor={PORTFOLIO_STROKE}
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="age"
              type="number"
              domain={[inputs.currentAge, lastPoint.age]}
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
              formatter={(value) =>
                currencyFormatter.format(Math.round(Number(value ?? 0)))
              }
              labelFormatter={(age) => `Age ${String(age)}`}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                fontSize: 12,
              }}
            />
            {VARIANT_ORDER.filter((variant) => visibility[variant]).map(
              (variant) => (
                <ReferenceLine
                  key={variant}
                  y={variants[variant].target}
                  stroke={VARIANT_THEME[variant].accentHex}
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  ifOverflow="extendDomain"
                  label={{
                    value: VARIANT_THEME[variant].label,
                    position: REFERENCE_LABEL_POSITION,
                    fill: VARIANT_THEME[variant].accentHex,
                    fontSize: 10,
                    fontWeight: 600,
                    offset: 4,
                  }}
                />
              ),
            )}
            <Area
              type="monotone"
              dataKey="portfolio"
              stroke={PORTFOLIO_STROKE}
              strokeWidth={2}
              fill="url(#portfolioFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <ul
        data-testid="growth-chart-legend"
        aria-label="Toggle FIRE target reference lines"
        className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600"
      >
        <li className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="inline-block h-2 w-3 rounded-sm"
            style={{ backgroundColor: PORTFOLIO_STROKE }}
          />
          Portfolio
        </li>
        {VARIANT_ORDER.map((variant) => {
          const theme = VARIANT_THEME[variant];
          const isVisible = visibility[variant];
          return (
            <li
              key={variant}
              data-testid={`growth-chart-legend-${variant}`}
              data-active={isVisible ? "true" : "false"}
              className="flex items-center"
            >
              <label className="inline-flex cursor-pointer items-center gap-1.5 select-none">
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={() => toggleVariant(variant)}
                  data-testid={`growth-chart-toggle-${variant}`}
                  aria-label={`Toggle ${theme.label} reference line`}
                  className="size-3.5 cursor-pointer rounded border-slate-300"
                  style={{ accentColor: theme.accentHex }}
                />
                <span
                  aria-hidden="true"
                  className="inline-block h-0.5 w-3 rounded-sm transition-opacity"
                  style={{
                    backgroundColor: theme.accentHex,
                    opacity: isVisible ? 1 : 0.3,
                  }}
                />
                <span
                  className="transition-colors"
                  style={{ color: isVisible ? undefined : "#94a3b8" }}
                >
                  {theme.label}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
