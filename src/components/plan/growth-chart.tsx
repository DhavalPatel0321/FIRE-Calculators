"use client";

import { useMemo } from "react";
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
import type { FireInputs } from "@/lib/calc/types";
import { useScenarioStore } from "@/store/scenario";

import { VARIANT_ORDER, VARIANT_THEME } from "./variant-theme";

const MIN_HORIZON_YEARS = 30;
const PORTFOLIO_STROKE = VARIANT_THEME.traditional.accentHex;

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

      <div className="h-64 w-full">
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
            {VARIANT_ORDER.map((variant) => (
              <ReferenceLine
                key={variant}
                y={variants[variant].target}
                stroke={VARIANT_THEME[variant].accentHex}
                strokeDasharray="4 4"
                strokeWidth={1.25}
                ifOverflow="extendDomain"
                label={{
                  value: VARIANT_THEME[variant].label,
                  position: "right",
                  fill: VARIANT_THEME[variant].accentHex,
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />
            ))}
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
        className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600"
      >
        <li className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="inline-block h-2 w-3 rounded-sm"
            style={{ backgroundColor: PORTFOLIO_STROKE }}
          />
          Portfolio
        </li>
        {VARIANT_ORDER.map((variant) => (
          <li
            key={variant}
            data-testid={`growth-chart-legend-${variant}`}
            className="flex items-center gap-1.5"
          >
            <span
              aria-hidden="true"
              className="inline-block h-0.5 w-3 rounded-sm"
              style={{ backgroundColor: VARIANT_THEME[variant].accentHex }}
            />
            {VARIANT_THEME[variant].label}
          </li>
        ))}
      </ul>
    </div>
  );
}
