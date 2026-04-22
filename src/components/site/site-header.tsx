import Link from "next/link";

type NavLink = {
  href: string;
  label: string;
};

const NAV_LINKS: readonly NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/plan", label: "Plan" },
  { href: "/learn", label: "Learn" },
];

export function SiteHeader() {
  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link
          href="/"
          data-testid="site-header-brand"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900"
        >
          <span
            aria-hidden="true"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-xs text-white"
          >
            FC
          </span>
          FIRE Calculators
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-testid={`site-header-nav-${link.label.toLowerCase()}`}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/plan"
          data-testid="site-header-cta"
          className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          Start planning
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </header>
  );
}
