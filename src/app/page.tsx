import Link from "next/link";

import {
  VARIANT_ORDER,
  VARIANT_THEME,
} from "@/components/plan/variant-theme";

const V1_FEATURES: readonly string[] = [
  "Shared inputs across Traditional, Coast, Barista, Lean, and Fat FIRE",
  "Interactive growth chart with every FIRE target overlayed",
  "Safe-withdrawal slider (3.0%–5.0%) with context on when each rate makes sense",
  "URL-shareable scenarios — no account required",
  "Side-by-side scenario comparison",
];

export default function LandingPage() {
  return (
    <main data-testid="landing-page" className="text-slate-900">
      <section className="px-6 pt-16 pb-10 sm:pt-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 ring-1 ring-inset ring-slate-200">
            v1 · Deterministic planner
          </span>
          <h1
            data-testid="landing-headline"
            className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
          >
            Know your FIRE number.{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              All five variants.
            </span>{" "}
            One input.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Enter your financial picture once and instantly see Traditional,
            Coast, Barista, Lean, and Fat FIRE — with a live growth chart and
            URL-shareable scenarios.
          </p>
          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/plan"
              data-testid="landing-cta-primary"
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
            >
              Start planning
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/learn"
              data-testid="landing-cta-secondary"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900"
            >
              Learn the basics
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Five flavors of FIRE
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-600">
              Every variant answers a slightly different retirement question.
              The planner computes them all from the same set of inputs.
            </p>
          </div>
          <ul
            data-testid="landing-variants"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
          >
            {VARIANT_ORDER.map((variant) => {
              const theme = VARIANT_THEME[variant];
              return (
                <li
                  key={variant}
                  data-testid={`landing-variant-${variant}`}
                  className="relative flex flex-col gap-1 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ backgroundColor: theme.accentHex }}
                  />
                  <span
                    className="pt-1 text-sm font-semibold"
                    style={{ color: theme.accentHex }}
                  >
                    {theme.label}
                  </span>
                  <p className="text-xs leading-5 text-slate-600">
                    {theme.tagline}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              What you get in v1
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              A deterministic planner, built to match reference calculators
              within 1% and deploy publicly with Lighthouse ≥ 90.
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-3 text-sm text-slate-700 sm:grid-cols-2">
            {V1_FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2"
              >
                <span
                  aria-hidden="true"
                  className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-orange-500"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 pt-6 pb-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-3xl bg-slate-950 px-8 py-10 text-center text-slate-100 shadow-sm">
          <h2 className="text-xl font-semibold sm:text-2xl">
            Ready to find your number?
          </h2>
          <p className="max-w-xl text-sm leading-6 text-slate-300">
            Free, no account needed. Your scenario stays in the URL.
          </p>
          <Link
            href="/plan"
            data-testid="landing-cta-footer"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-200"
          >
            Start planning
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
