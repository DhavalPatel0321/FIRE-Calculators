export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-20 text-slate-900">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          FIRE Calculators
        </p>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            The deterministic FIRE planner is being assembled.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            v1 will ship a shared-input planner for Traditional, Coast,
            Barista, Lean, and Fat FIRE, with charting, comparison, and
            educational pages.
          </p>
        </div>
        <div className="grid gap-3 rounded-2xl bg-slate-950 p-6 text-sm text-slate-200 sm:grid-cols-3">
          <div>
            <p className="font-medium text-white">Planner</p>
            <p className="mt-1 text-slate-300">Shared inputs and live variant results.</p>
          </div>
          <div>
            <p className="font-medium text-white">Learn</p>
            <p className="mt-1 text-slate-300">MDX explainers for FIRE concepts and SWR.</p>
          </div>
          <div>
            <p className="font-medium text-white">Compare</p>
            <p className="mt-1 text-slate-300">Scenario overlays and URL-shareable state.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
