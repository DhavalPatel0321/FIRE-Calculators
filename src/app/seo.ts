export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://fire-calculators.vercel.app";

export const SITE_NAME = "FIRE Calculators";

export const PUBLIC_ROUTES = [
  "/",
  "/plan",
  "/plan/compare",
  "/learn",
  "/learn/fire-basics",
  "/learn/traditional-fire",
  "/learn/coast-fire",
  "/learn/barista-fire",
  "/learn/lean-fire",
  "/learn/fat-fire",
  "/learn/swr",
] as const;

export function absoluteUrl(pathname: string) {
  return new URL(pathname, SITE_URL).toString();
}
