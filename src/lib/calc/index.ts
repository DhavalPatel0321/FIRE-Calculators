import { calculateBaristaFire } from "@/lib/calc/variants/barista";
import { calculateCoastFire } from "@/lib/calc/variants/coast";
import { calculateFatFire, calculateLeanFire } from "@/lib/calc/variants/lean-fat";
import { calculateTraditionalFire } from "@/lib/calc/variants/traditional";
import type { FireInputs, FireResult, FireVariant } from "@/lib/calc/types";

// Compute every deterministic v1 calculator from the same shared input contract.
export function computeAllVariants(
  inputs: FireInputs,
): Record<FireVariant, FireResult> {
  return {
    traditional: calculateTraditionalFire(inputs),
    coast: calculateCoastFire(inputs),
    barista: calculateBaristaFire(inputs),
    lean: calculateLeanFire(inputs),
    fat: calculateFatFire(inputs),
  };
}

export { DEFAULT_INPUTS } from "@/lib/calc/defaults";
export { projectPortfolio } from "@/lib/calc/projection";
export { yearsToReachTarget } from "@/lib/calc/solver";
export { SWR_PRESETS } from "@/lib/calc/swr-presets";
export type {
  FireInputs,
  FireResult,
  FireVariant,
  ProjectionPoint,
  SwrPreset,
} from "@/lib/calc/types";
export { calculateBaristaFire } from "@/lib/calc/variants/barista";
export { calculateCoastFire } from "@/lib/calc/variants/coast";
export {
  calculateFatFire,
  calculateLeanFire,
} from "@/lib/calc/variants/lean-fat";
export { calculateTraditionalFire } from "@/lib/calc/variants/traditional";
