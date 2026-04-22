import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { SiteHeader } from "@/components/site/site-header";

describe("<SiteHeader />", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the brand link pointing at /", () => {
    render(<SiteHeader />);
    const brand = screen.getByTestId("site-header-brand");
    expect(brand).toHaveTextContent("FIRE Calculators");
    expect(brand).toHaveAttribute("href", "/");
  });

  it("renders primary nav links with the right hrefs", () => {
    render(<SiteHeader />);
    expect(screen.getByTestId("site-header-nav-home")).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByTestId("site-header-nav-plan")).toHaveAttribute(
      "href",
      "/plan",
    );
    expect(screen.getByTestId("site-header-nav-learn")).toHaveAttribute(
      "href",
      "/learn",
    );
  });

  it("sends the CTA to /plan", () => {
    render(<SiteHeader />);
    const cta = screen.getByTestId("site-header-cta");
    expect(cta).toHaveTextContent(/start planning/i);
    expect(cta).toHaveAttribute("href", "/plan");
  });
});
