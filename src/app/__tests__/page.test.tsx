import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import LandingPage from "@/app/page";
import { VARIANT_ORDER } from "@/components/plan/variant-theme";

describe("Landing page", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the primary headline", () => {
    render(<LandingPage />);
    const headline = screen.getByTestId("landing-headline");
    expect(headline).toHaveTextContent(/know your fire number/i);
    expect(headline).toHaveTextContent(/all five variants/i);
  });

  it("points the primary CTA at /plan", () => {
    render(<LandingPage />);
    expect(screen.getByTestId("landing-cta-primary")).toHaveAttribute(
      "href",
      "/plan",
    );
    expect(screen.getByTestId("landing-cta-footer")).toHaveAttribute(
      "href",
      "/plan",
    );
  });

  it("renders one card per FIRE variant", () => {
    render(<LandingPage />);
    for (const variant of VARIANT_ORDER) {
      expect(
        screen.getByTestId(`landing-variant-${variant}`),
      ).toBeInTheDocument();
    }
  });
});
