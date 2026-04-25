// Distinct from VARIANT_THEME: each compare slot gets its own color so up to
// three overlaid trajectories stay visually separable. Slot colors are stable
// — slot 1 is always slate, slot 2 emerald, slot 3 violet — so a shared URL
// reproduces the same visuals on someone else's screen.
export const SCENARIO_PALETTE = [
  { hex: "#0f172a", swatchClass: "bg-slate-900" },
  { hex: "#10b981", swatchClass: "bg-emerald-500" },
  { hex: "#8b5cf6", swatchClass: "bg-violet-500" },
] as const;

export type ScenarioPaletteEntry = (typeof SCENARIO_PALETTE)[number];
