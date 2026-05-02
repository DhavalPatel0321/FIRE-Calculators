"use client";

import Link from "next/link";

import { encodeCompareScenarios } from "@/lib/url/compare";
import { useScenarioStore } from "@/store/scenario";

export function PlanCompareLink() {
  const inputs = useScenarioStore((state) => state.inputs);
  const params = encodeCompareScenarios([
    { id: "s1", label: "Current planner", inputs },
  ]);
  const search = params.toString();
  const href = `/plan/compare${search ? `?${search}` : ""}`;

  return (
    <Link
      href={href}
      data-testid="plan-compare-link"
      className="inline-flex items-center gap-1 self-start rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 sm:self-end"
    >
      Compare scenarios
      <span aria-hidden="true">→</span>
    </Link>
  );
}
