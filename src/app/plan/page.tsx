import type { Metadata } from "next";

import { GrowthChart } from "@/components/plan/growth-chart";
import { InputPanel } from "@/components/plan/input-panel";
import { ResultCards } from "@/components/plan/result-cards";

export const metadata: Metadata = {
  title: "Plan · FIRE Calculators",
  description:
    "Enter your financial picture once and see Traditional, Coast, Barista, Lean, and Fat FIRE side-by-side.",
};

export default function PlanPage() {
  return (
    <main
      data-testid="plan-page"
      className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Planner
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Your FIRE Numbers
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            Enter your inputs once and see every variant update live. Inputs,
            results, and the growth chart will fill in as the planner is built.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          <section
            data-testid="plan-inputs"
            aria-label="Scenario inputs"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <InputPanel />
          </section>

          <div className="flex flex-col gap-6">
            <section
              data-testid="plan-results"
              aria-label="FIRE variant results"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <ResultCards />
            </section>

            <section
              data-testid="plan-chart"
              aria-label="Portfolio growth chart"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <GrowthChart />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
