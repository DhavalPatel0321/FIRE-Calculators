import { DEFAULT_INPUTS } from "@/lib/calc/defaults";
import type { FireInputs } from "@/lib/calc/types";
import { decodeScenario, encodeScenario } from "@/lib/url/scenario";

export const MAX_COMPARE_SCENARIOS = 3;

export type CompareScenario = {
  id: string;
  label: string;
  inputs: FireInputs;
};

const SLOT_KEYS = ["s1", "s2", "s3"] as const;
type SlotKey = (typeof SLOT_KEYS)[number];

const LABEL_KEY_PREFIX = "label";

function slotForIndex(index: number): SlotKey {
  if (index < 0 || index >= SLOT_KEYS.length) {
    throw new Error(`Compare slot index out of range: ${index}`);
  }
  return SLOT_KEYS[index];
}

// Serialize an ordered list of compare scenarios into a single URLSearchParams.
// Per scenario, only fields diverging from DEFAULT_INPUTS are emitted, prefixed
// with the slot id (e.g. "s1.currentAge=45"). Labels emit only when they
// diverge from the auto-generated "Scenario N".
export function encodeCompareScenarios(
  scenarios: readonly CompareScenario[],
): URLSearchParams {
  const params = new URLSearchParams();

  scenarios.slice(0, MAX_COMPARE_SCENARIOS).forEach((scenario, index) => {
    const slot = slotForIndex(index);
    const fields = encodeScenario(scenario.inputs);
    for (const [key, value] of fields.entries()) {
      params.set(`${slot}.${key}`, value);
    }
    const autoLabel = defaultLabelForIndex(index);
    if (scenario.label && scenario.label !== autoLabel) {
      params.set(`${slot}.${LABEL_KEY_PREFIX}`, scenario.label);
    }
  });

  return params;
}

// Inverse of encodeCompareScenarios. Slot order is preserved; missing slots
// produce no scenario entry. Unknown / malformed values are dropped silently.
export function decodeCompareScenarios(
  params: URLSearchParams,
): CompareScenario[] {
  const perSlot: Record<SlotKey, URLSearchParams> = {
    s1: new URLSearchParams(),
    s2: new URLSearchParams(),
    s3: new URLSearchParams(),
  };
  const labels: Partial<Record<SlotKey, string>> = {};

  for (const [rawKey, value] of params.entries()) {
    const dot = rawKey.indexOf(".");
    if (dot < 1) continue;
    const slot = rawKey.slice(0, dot);
    if (!isSlotKey(slot)) continue;
    const innerKey = rawKey.slice(dot + 1);
    if (innerKey === LABEL_KEY_PREFIX) {
      if (value !== "") labels[slot] = value;
      continue;
    }
    perSlot[slot].set(innerKey, value);
  }

  const scenarios: CompareScenario[] = [];
  SLOT_KEYS.forEach((slot, index) => {
    const slotParams = perSlot[slot];
    const partial = decodeScenario(slotParams);
    const hasLabel = labels[slot] !== undefined;
    const hasFields = Object.keys(partial).length > 0;
    if (!hasLabel && !hasFields) return;
    scenarios.push({
      id: slot,
      label: labels[slot] ?? defaultLabelForIndex(index),
      inputs: { ...DEFAULT_INPUTS, ...partial },
    });
  });

  return scenarios;
}

export function defaultLabelForIndex(index: number): string {
  return `Scenario ${index + 1}`;
}

function isSlotKey(value: string): value is SlotKey {
  return (SLOT_KEYS as readonly string[]).includes(value);
}
