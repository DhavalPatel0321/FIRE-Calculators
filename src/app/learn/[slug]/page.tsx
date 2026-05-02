import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { VARIANT_ORDER, VARIANT_THEME } from "@/components/plan/variant-theme";

const COMING_SOON_SLUGS = [
  ...VARIANT_ORDER.map((variant) => `${variant}-fire`),
  "swr",
] as const;

type ComingSoonSlug = (typeof COMING_SOON_SLUGS)[number];

const SLUG_SET = new Set<string>(COMING_SOON_SLUGS);

function titleForSlug(slug: ComingSoonSlug) {
  if (slug === "swr") return "Safe withdrawal rates";

  const variant = slug.replace("-fire", "") as (typeof VARIANT_ORDER)[number];
  return `${VARIANT_THEME[variant].label} FIRE`;
}

export function generateStaticParams() {
  return COMING_SOON_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  if (!SLUG_SET.has(params.slug)) {
    return {};
  }

  return {
    title: `${titleForSlug(params.slug as ComingSoonSlug)} · FIRE Calculators`,
    description: "This FIRE explainer page is planned for the next content step.",
  };
}

export default function LearnStubPage({
  params,
}: {
  params: { slug: string };
}) {
  if (!SLUG_SET.has(params.slug)) notFound();

  const title = titleForSlug(params.slug as ComingSoonSlug);

  return (
    <div
      data-testid={`learn-stub-${params.slug}`}
      className="flex max-w-3xl flex-col gap-5"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
        Learn
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
        {title}
      </h1>
      <p className="text-base leading-7 text-slate-700">
        This explainer is queued for the next content step. For now, start with
        the FIRE basics overview or use the planner to compare the current
        deterministic calculations.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/learn/fire-basics"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          Read FIRE basics
        </Link>
        <Link
          href="/plan"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900"
        >
          Open planner
        </Link>
      </div>
    </div>
  );
}
