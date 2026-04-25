"use client";

import { useId, useState } from "react";

import { CopyUrlButton } from "@/components/plan/copy-url-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { FireInputs } from "@/lib/calc/types";
import { useScenarioStore } from "@/store/scenario";

type NumericFireInputKey = {
  [K in keyof FireInputs]-?: FireInputs[K] extends number | undefined
    ? K
    : never;
}[keyof FireInputs];

const thousandsFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  useGrouping: true,
});

// Display integers with thousands separators, no fractional part. Used for
// every $ field and the age fields. `undefined` and `0` both render as ""
// so the field never displays a leading zero.
export function formatNumberDisplay(value: number | undefined): string {
  if (value === undefined) return "";
  if (!Number.isFinite(value)) return "";
  if (value === 0) return "";
  return thousandsFormatter.format(Math.trunc(value));
}

// Strip everything that isn't a digit (commas, spaces, hyphens, leading
// zeros) and return the resulting integer. Empty inputs return null so the
// caller can treat them as "cleared" rather than "zero" if needed.
export function sanitizeNumberInput(raw: string): number | null {
  const digitsOnly = raw.replace(/\D/g, "");
  if (digitsOnly === "") return null;
  const parsed = Number(digitsOnly);
  return Number.isFinite(parsed) ? parsed : null;
}

type NumberFieldProps = {
  field: NumericFireInputKey;
  label: string;
  value: number | undefined;
  prefix?: string;
  suffix?: string;
};

function NumberField({
  field,
  label,
  value,
  prefix,
  suffix,
}: NumberFieldProps) {
  const id = useId();
  const setInput = useScenarioStore((state) => state.setInput);
  // While focused, render exactly what the user typed so caret + leading-zero
  // editing feel natural. On blur the field re-derives from the store, which
  // strips leading zeros and adds thousands separators.
  const [draftValue, setDraftValue] = useState<string | null>(null);

  const displayValue =
    draftValue !== null ? draftValue : formatNumberDisplay(value);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-slate-600">
        {label}
      </Label>
      <div className="relative flex items-center">
        {prefix ? (
          <span className="pointer-events-none absolute left-2.5 text-xs text-slate-500">
            {prefix}
          </span>
        ) : null}
        <Input
          id={id}
          data-testid={`input-${field}`}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={displayValue}
          onFocus={() => {
            // Seed the draft from the current store value so the user can
            // edit in place without commas tripping up the caret.
            setDraftValue(value === undefined || value === 0 ? "" : String(Math.trunc(value)));
          }}
          onChange={(event) => {
            const raw = event.target.value;
            setDraftValue(raw);
            const sanitized = sanitizeNumberInput(raw);
            setInput(field, sanitized ?? 0);
          }}
          onBlur={() => setDraftValue(null)}
          className={prefix ? "pl-6" : undefined}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-2.5 text-xs text-slate-500">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}

type PercentSliderProps = {
  field: NumericFireInputKey;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
};

function PercentSlider({
  field,
  label,
  value,
  min,
  max,
  step,
}: PercentSliderProps) {
  const id = useId();
  const setInput = useScenarioStore((state) => state.setInput);
  const display = `${(value * 100).toFixed(1)}%`;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-xs font-medium text-slate-600">
          {label}
        </Label>
        <span
          data-testid={`slider-value-${field}`}
          className="text-xs font-semibold text-slate-900 tabular-nums"
        >
          {display}
        </span>
      </div>
      <Slider
        id={id}
        data-testid={`slider-${field}`}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(nextValue) => {
          const next = Array.isArray(nextValue) ? nextValue[0] : nextValue;
          if (typeof next === "number" && Number.isFinite(next)) {
            setInput(field, next);
          }
        }}
      />
      <div className="flex justify-between text-[10px] text-slate-400 tabular-nums">
        <span>{(min * 100).toFixed(1)}%</span>
        <span>{(max * 100).toFixed(1)}%</span>
      </div>
    </div>
  );
}

export function InputPanel() {
  const inputs = useScenarioStore((state) => state.inputs);
  const resetInputs = useScenarioStore((state) => state.resetInputs);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Your Inputs</h2>
        <div className="flex items-center gap-1">
          <CopyUrlButton />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            data-testid="reset-inputs"
            onClick={resetInputs}
          >
            Reset
          </Button>
        </div>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Personal
        </legend>
        <NumberField
          field="currentAge"
          label="Current age"
          value={inputs.currentAge}
        />
        <NumberField
          field="targetRetirementAge"
          label="Target retirement age"
          value={inputs.targetRetirementAge}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Financial
        </legend>
        <NumberField
          field="currentInvested"
          label="Current invested assets"
          value={inputs.currentInvested}
          prefix="$"
        />
        <NumberField
          field="annualContribution"
          label="Annual contribution"
          value={inputs.annualContribution}
          prefix="$"
        />
        <NumberField
          field="annualExpenses"
          label="Annual expenses"
          value={inputs.annualExpenses}
          prefix="$"
        />
        <NumberField
          field="partTimeIncome"
          label="Part-time income (Barista)"
          value={inputs.partTimeIncome}
          prefix="$"
        />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          Assumptions
        </legend>
        <PercentSlider
          field="expectedRealReturn"
          label="Expected real return"
          value={inputs.expectedRealReturn}
          min={0}
          max={0.12}
          step={0.005}
        />
        <PercentSlider
          field="safeWithdrawalRate"
          label="Safe withdrawal rate"
          value={inputs.safeWithdrawalRate}
          min={0.03}
          max={0.05}
          step={0.001}
        />
      </fieldset>

      <details className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Advanced
        </summary>
        <div className="mt-3 flex flex-col gap-3">
          <PercentSlider
            field="inflationRate"
            label="Inflation rate (nominal mode)"
            value={inputs.inflationRate}
            min={0}
            max={0.1}
            step={0.005}
          />
          <NumberField
            field="leanExpenses"
            label="Lean FIRE expenses"
            value={inputs.leanExpenses}
            prefix="$"
          />
          <NumberField
            field="fatExpenses"
            label="Fat FIRE expenses"
            value={inputs.fatExpenses}
            prefix="$"
          />
        </div>
      </details>
    </div>
  );
}
