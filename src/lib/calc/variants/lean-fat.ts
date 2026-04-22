import { calculateTraditionalFire } from "@/lib/calc/variants/traditional";
import type { FireInputs, FireResult } from "@/lib/calc/types";

const DEFAULT_LEAN_EXPENSES = 35_000;
const DEFAULT_FAT_EXPENSES = 150_000;

function calculateExpenseAdjustedFire(
  inputs: FireInputs,
  annualExpenses: number,
  variant: FireResult["variant"],
) {
  const traditionalResult = calculateTraditionalFire({
    ...inputs,
    annualExpenses,
  });

  return {
    ...traditionalResult,
    variant,
  };
}

export function calculateLeanFire(inputs: FireInputs) {
  return calculateExpenseAdjustedFire(
    inputs,
    inputs.leanExpenses ?? DEFAULT_LEAN_EXPENSES,
    "lean",
  );
}

export function calculateFatFire(inputs: FireInputs) {
  return calculateExpenseAdjustedFire(
    inputs,
    inputs.fatExpenses ?? DEFAULT_FAT_EXPENSES,
    "fat",
  );
}
