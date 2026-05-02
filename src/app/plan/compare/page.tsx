import type { Metadata } from "next";

import { absoluteUrl } from "@/app/seo";
import { CompareView } from "@/components/plan/compare-view";

export const metadata: Metadata = {
  title: "Compare",
  description:
    "Overlay up to three FIRE scenarios on one chart and share them via URL.",
  alternates: {
    canonical: absoluteUrl("/plan/compare"),
  },
  openGraph: {
    title: "Compare · FIRE Calculators",
    description:
      "Overlay up to three FIRE scenarios on one chart and share them via URL.",
    url: absoluteUrl("/plan/compare"),
  },
};

export default function ComparePage() {
  return <CompareView />;
}
