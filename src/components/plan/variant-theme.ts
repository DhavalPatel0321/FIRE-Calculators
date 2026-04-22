import type { FireVariant } from "@/lib/calc/types";

export type VariantTheme = {
  label: string;
  tagline: string;
  accentHex: string;
  accentClass: string;
  badgeClass: string;
};

export const VARIANT_ORDER: readonly FireVariant[] = [
  "traditional",
  "coast",
  "barista",
  "lean",
  "fat",
] as const;

export const VARIANT_THEME: Record<FireVariant, VariantTheme> = {
  traditional: {
    label: "Traditional",
    tagline: "25× expenses at your SWR.",
    accentHex: "#f97316",
    accentClass: "bg-orange-500",
    badgeClass: "bg-orange-50 text-orange-700 ring-orange-200",
  },
  coast: {
    label: "Coast",
    tagline: "Stop contributing, compound to FI by your target age.",
    accentHex: "#3b82f6",
    accentClass: "bg-blue-500",
    badgeClass: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  barista: {
    label: "Barista",
    tagline: "Part-time income covers the gap.",
    accentHex: "#a855f7",
    accentClass: "bg-purple-500",
    badgeClass: "bg-purple-50 text-purple-700 ring-purple-200",
  },
  lean: {
    label: "Lean",
    tagline: "Minimalist lifestyle, smaller target.",
    accentHex: "#10b981",
    accentClass: "bg-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  fat: {
    label: "Fat",
    tagline: "Premium lifestyle, larger target.",
    accentHex: "#f59e0b",
    accentClass: "bg-amber-500",
    badgeClass: "bg-amber-50 text-amber-700 ring-amber-200",
  },
};
