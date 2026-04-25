import { DEFAULT_INPUTS } from "@/lib/calc/defaults";
import type { FireInputs } from "@/lib/calc/types";

// Order kept stable so encoded URLs stay diff-friendly across runs.
const FIRE_INPUT_KEYS: readonly (keyof FireInputs)[] = [
  "currentAge",
  "targetRetirementAge",
  "currentInvested",
  "annualContribution",
  "annualExpenses",
  "partTimeIncome",
  "expectedRealReturn",
  "inflationRate",
  "safeWithdrawalRate",
  "leanExpenses",
  "fatExpenses",
] as const;

const FIRE_INPUT_KEY_SET = new Set<string>(FIRE_INPUT_KEYS);

function isFireInputKey(key: string): key is keyof FireInputs {
  return FIRE_INPUT_KEY_SET.has(key);
}

function encodeNumber(value: number): string {
  // Avoid exponential notation; trim trailing zeros via toString roundtrip.
  return Number.isInteger(value) ? value.toString() : value.toString();
}

// Serialize only the fields that diverge from DEFAULT_INPUTS so shared URLs
// stay short. Optional fields (lean/fat overrides) only emit when set AND
// different from their default.
export function encodeScenario(inputs: FireInputs): URLSearchParams {
  const params = new URLSearchParams();

  for (const key of FIRE_INPUT_KEYS) {
    const value = inputs[key];
    const defaultValue = DEFAULT_INPUTS[key];

    if (value === undefined) continue;
    if (value === defaultValue) continue;
    if (typeof value !== "number" || !Number.isFinite(value)) continue;

    params.set(key, encodeNumber(value));
  }

  return params;
}

// Coerce known keys to finite numbers; drop unknown keys, NaN, infinities, and
// non-numeric strings. Returns a partial so callers can merge into existing state.
export function decodeScenario(params: URLSearchParams): Partial<FireInputs> {
  const partial: Partial<FireInputs> = {};

  for (const [rawKey, rawValue] of params.entries()) {
    if (!isFireInputKey(rawKey)) continue;
    if (rawValue === "") continue;

    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed)) continue;

    partial[rawKey] = parsed;
  }

  return partial;
}
