import Link from "next/link";

const REPO_URL = "https://github.com/DhavalPatel0321/FIRE-Calculators";

export function SiteFooter() {
  return (
    <footer
      data-testid="site-footer"
      className="border-t border-slate-200 bg-white"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} FIRE Calculators</p>
        <p className="max-w-sm text-slate-400">
          Educational tool. Not financial advice. Projections are deterministic
          and ignore taxes, sequence risk, and fees.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/learn"
            className="text-slate-500 transition-colors hover:text-slate-900"
          >
            Learn
          </Link>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer noopener"
            data-testid="site-footer-repo"
            className="text-slate-500 transition-colors hover:text-slate-900"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
