import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import BaristaFirePage from "@/app/learn/barista-fire/page.mdx";
import CoastFirePage from "@/app/learn/coast-fire/page.mdx";
import FatFirePage from "@/app/learn/fat-fire/page.mdx";
import FireBasicsPage from "@/app/learn/fire-basics/page.mdx";
import LearnPage from "@/app/learn/page";
import LeanFirePage from "@/app/learn/lean-fire/page.mdx";
import SwrPage from "@/app/learn/swr/page.mdx";
import TraditionalFirePage from "@/app/learn/traditional-fire/page.mdx";
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

  it("points secondary CTAs at real app routes", () => {
    render(<LandingPage />);
    expect(screen.getByTestId("landing-cta-compare")).toHaveAttribute(
      "href",
      "/plan/compare",
    );
    expect(screen.getByTestId("landing-cta-secondary")).toHaveAttribute(
      "href",
      "/learn",
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

describe("Learn page", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders a card for each planned explainer", () => {
    render(<LearnPage />);

    const expectedSlugs = [
      "fire-basics",
      "traditional-fire",
      "coast-fire",
      "barista-fire",
      "lean-fire",
      "fat-fire",
      "swr",
    ];

    for (const slug of expectedSlugs) {
      expect(screen.getByTestId(`learn-card-${slug}`)).toHaveAttribute(
        "href",
        `/learn/${slug}`,
      );
    }
  });

  it("renders the fire-basics MDX headline and planner link", () => {
    render(<FireBasicsPage />);

    expect(
      screen.getByRole("heading", { name: /fire basics/i, level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText(/the common 4% rule/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /planner/i })).toHaveAttribute(
      "href",
      "/plan",
    );
  });

  it.each([
    {
      Component: TraditionalFirePage,
      heading: /traditional fire/i,
      concept: /annualExpenses \/ safeWithdrawalRate/i,
    },
    {
      Component: CoastFirePage,
      heading: /coast fire/i,
      concept: /fireNumber \/ \(1 \+ expectedRealReturn\)/i,
    },
    {
      Component: BaristaFirePage,
      heading: /barista fire/i,
      concept: /annualExpenses - partTimeIncome/i,
    },
    {
      Component: LeanFirePage,
      heading: /lean fire/i,
      concept: /\$875,000 lean fire target/i,
    },
    {
      Component: FatFirePage,
      heading: /fat fire/i,
      concept: /\$3,750,000 fat fire target/i,
    },
    {
      Component: SwrPage,
      heading: /safe withdrawal rates/i,
      concept: /25\.0x expenses/i,
    },
  ])("renders the $heading explainer with a canonical concept", ({
    Component,
    heading,
    concept,
  }) => {
    render(<Component />);

    expect(screen.getByRole("heading", { name: heading, level: 1 })).toBeInTheDocument();
    expect(screen.getByText(concept)).toBeInTheDocument();
  });
});
