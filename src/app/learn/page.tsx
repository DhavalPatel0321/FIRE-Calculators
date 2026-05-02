import type { Metadata } from "next";
import Link from "next/link";

import { absoluteUrl } from "@/app/seo";
import { VARIANT_ORDER, VARIANT_THEME } from "@/components/plan/variant-theme";
import type { FireVariant } from "@/lib/calc/types";

type LearnCard = {
  slug: string;
  title: string;
  description: string;
  variant?: FireVariant;
};

const VARIANT_CARDS: LearnCard[] = VARIANT_ORDER.map((variant) => ({
  slug: `${variant}-fire`,
  title: `${VARIANT_THEME[variant].label} FIRE`,
  description: VARIANT_THEME[variant].tagline,
  variant,
}));

const LEARN_CARDS: LearnCard[] = [
  {
    slug: "fire-basics",
    title: "FIRE basics",
    description: "What financial independence means and how the planner works.",
  },
  ...VARIANT_CARDS,
  {
    slug: "swr",
    title: "Safe withdrawal rates",
    description: "Why 3.0% to 5.0% changes the target portfolio so much.",
  },
];

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Educational FIRE explainers for FIRE basics, variants, and safe withdrawal rates.",
  alternates: {
    canonical: absoluteUrl("/learn"),
  },
  openGraph: {
    title: "Learn · FIRE Calculators",
    description:
      "Educational FIRE explainers for FIRE basics, variants, and safe withdrawal rates.",
    url: absoluteUrl("/learn"),
  },
};

export default function LearnPage() {
  return (
    <div data-testid="learn-page" className="flex flex-col gap-10">
      <header className="flex max-w-3xl flex-col gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Learn
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          FIRE explainers
        </h1>
        <p className="text-base leading-7 text-slate-600">
          Start with the basics, then go deeper on each FIRE variant and the
          safe withdrawal rate assumption that drives every target.
        </p>
      </header>

      <section
        aria-label="FIRE explainer pages"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {LEARN_CARDS.map((card) => {
          const theme = card.variant ? VARIANT_THEME[card.variant] : null;
          return (
            <Link
              key={card.slug}
              href={`/learn/${card.slug}`}
              data-testid={`learn-card-${card.slug}`}
              className="group flex min-h-44 flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-300"
            >
              <div className="flex flex-col gap-3">
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-10 rounded-full ${
                    theme?.accentClass ?? "bg-slate-900"
                  }`}
                />
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg font-semibold text-slate-950">
                    {card.title}
                  </h2>
                  <p className="text-sm leading-6 text-slate-600">
                    {card.description}
                  </p>
                </div>
              </div>
              <span className="mt-5 text-sm font-semibold text-slate-900">
                Read explainer <span aria-hidden="true">→</span>
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
