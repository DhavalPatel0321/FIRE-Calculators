import {
  defaultLabelForIndex,
  MAX_COMPARE_SCENARIOS,
  type CompareScenario,
} from "@/lib/url/compare";
import type { FireInputs } from "@/lib/calc/types";

export type CompareState = {
  scenarios: CompareScenario[];
};

export type CompareAction =
  | { type: "hydrate"; scenarios: CompareScenario[] }
  | { type: "add"; inputs: FireInputs; label?: string }
  | { type: "remove"; id: string }
  | { type: "clear" };

export const initialCompareState: CompareState = { scenarios: [] };

export function compareReducer(
  state: CompareState,
  action: CompareAction,
): CompareState {
  switch (action.type) {
    case "hydrate":
      // Re-key by slot index so slots stay in canonical order regardless of
      // what the URL handed us.
      return {
        scenarios: action.scenarios
          .slice(0, MAX_COMPARE_SCENARIOS)
          .map((scenario, index) => ({
            ...scenario,
            id: `s${index + 1}`,
          })),
      };

    case "add": {
      if (state.scenarios.length >= MAX_COMPARE_SCENARIOS) return state;
      const nextIndex = state.scenarios.length;
      return {
        scenarios: [
          ...state.scenarios,
          {
            id: `s${nextIndex + 1}`,
            label: action.label ?? defaultLabelForIndex(nextIndex),
            inputs: action.inputs,
          },
        ],
      };
    }

    case "remove": {
      const remaining = state.scenarios.filter((s) => s.id !== action.id);
      // Re-key remaining slots so ids stay s1..sN with no gaps.
      return {
        scenarios: remaining.map((scenario, index) => ({
          ...scenario,
          id: `s${index + 1}`,
        })),
      };
    }

    case "clear":
      return initialCompareState;

    default:
      return state;
  }
}
