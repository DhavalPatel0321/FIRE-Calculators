import type { Metadata } from "next";

import { CompareView } from "@/components/plan/compare-view";

export const metadata: Metadata = {
  title: "Compare · FIRE Calculators",
  description:
    "Overlay up to three FIRE scenarios on one chart and share them via URL.",
};

export default function ComparePage() {
  return <CompareView />;
}
