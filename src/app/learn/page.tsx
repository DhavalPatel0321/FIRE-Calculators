import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Learn · FIRE Calculators",
  description:
    "Educational FIRE explainers are coming next. Start with the planner today.",
};

export default function LearnPlaceholderPage() {
  return (
    <main
      data-testid="learn-placeholder-page"
      className="px-6 py-16 text-slate-900"
    >
      <section className="mx-auto flex max-w-3xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Learn
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            FIRE explainers are coming next
          </h1>
          <p className="text-sm leading-6 text-slate-600 sm:text-base">
            The planner is live now. The next content sprint adds focused
            explainers for FIRE basics, each FIRE variant, and safe withdrawal
            rates.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <h2 className="font-semibold text-slate-900">Fire basics</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              What FIRE means and how the 4% rule anchors the math.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <h2 className="font-semibold text-slate-900">Five variants</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Traditional, Coast, Barista, Lean, and Fat FIRE in context.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <h2 className="font-semibold text-slate-900">SWR guide</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Why 3.0% to 5.0% changes the target portfolio so much.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/plan"
            data-testid="learn-placeholder-plan-link"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Start with the planner
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900"
          >
            Back to overview
          </Link>
        </div>
      </section>
    </main>
  );
}
