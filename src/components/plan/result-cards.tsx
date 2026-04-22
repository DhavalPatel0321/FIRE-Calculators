"use client";

import { useMemo } from "react";

import { computeAllVariants } from "@/lib/calc";
import type { FireResult, FireVariant } from "@/lib/calc/types";
import { cn } from "@/lib/utils";
import { useScenarioStore } from "@/store/scenario";

import { VARIANT_ORDER, VARIANT_THEME } from "./variant-theme";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatYears(years: number): string {
  return `${years.toFixed(1)} years`;
}

function formatAge(currentAge: number, years: number): string {
  const age = currentAge + years;
  const rounded = Math.round(age * 10) / 10;
  return `age ${rounded.toFixed(1)}`;
}

type ResultCardProps = {
  variant: FireVariant;
  result: FireResult;
  currentAge: number;
};

function ResultCard({ variant, result, currentAge }: ResultCardProps) {
  const theme = VARIANT_THEME[variant];
  const target = currencyFormatter.format(Math.round(result.target));

  return (
    <div
      data-testid={`result-card-${variant}`}
      className="relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div
        aria-hidden="true"
        className={cn("absolute inset-x-0 top-0 h-1", theme.accentClass)}
      />
      <div className="flex items-center justify-between pt-1">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] ring-1 ring-inset",
            theme.badgeClass,
          )}
        >
          {theme.label}
        </span>
      </div>
      <div
        data-testid={`result-number-${variant}`}
        className="text-2xl font-semibold tracking-tight text-slate-900 tabular-nums sm:text-3xl"
      >
        {target}
      </div>
      <div
        data-testid={`result-timeline-${variant}`}
        className="text-xs font-medium text-slate-600 tabular-nums"
      >
        {result.alreadyReached
          ? "Already FI"
          : `${formatYears(result.yearsToReach)} · ${formatAge(
              currentAge,
              result.yearsToReach,
            )}`}
      </div>
      <p className="text-xs leading-5 text-slate-500">{theme.tagline}</p>
    </div>
  );
}

export function ResultCards() {
  const inputs = useScenarioStore((state) => state.inputs);
  const results = useMemo(() => computeAllVariants(inputs), [inputs]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Your FIRE numbers</h2>
        <p className="text-xs text-slate-500">Live, deterministic projections.</p>
      </div>
      <div
        data-testid="result-cards-grid"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
      >
        {VARIANT_ORDER.map((variant) => (
          <ResultCard
            key={variant}
            variant={variant}
            result={results[variant]}
            currentAge={inputs.currentAge}
          />
        ))}
      </div>
    </div>
  );
}
