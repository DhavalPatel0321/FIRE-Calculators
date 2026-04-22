import { create } from "zustand";

import { DEFAULT_INPUTS } from "@/lib/calc/defaults";
import type { FireInputs } from "@/lib/calc/types";

export type ScenarioState = {
  inputs: FireInputs;
  setInput: <K extends keyof FireInputs>(key: K, value: FireInputs[K]) => void;
  resetInputs: () => void;
};

export const useScenarioStore = create<ScenarioState>((set) => ({
  inputs: { ...DEFAULT_INPUTS },
  setInput: (key, value) =>
    set((state) => ({ inputs: { ...state.inputs, [key]: value } })),
  resetInputs: () => set({ inputs: { ...DEFAULT_INPUTS } }),
}));
