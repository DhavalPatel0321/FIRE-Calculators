import { expect, test } from "@playwright/test";

test("golden path: plan, compare, and learn", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("landing-headline")).toContainText(
    "All five variants",
  );
  await page.getByTestId("landing-cta-primary").click();

  await expect(page).toHaveURL(/\/plan$/);
  await expect(page.getByTestId("plan-page")).toBeVisible();
  await expect(page.getByTestId("result-card-traditional")).toBeVisible();
  await expect(page.getByTestId("growth-chart")).toBeVisible();

  const contributionInput = page.getByTestId("input-annualContribution");
  await contributionInput.click();
  await contributionInput.press("ControlOrMeta+A");
  await contributionInput.fill("55,000");
  await contributionInput.blur();
  await expect(contributionInput).toHaveValue("55,000");

  await page.getByTestId("plan-compare-link").click();
  await expect(page).toHaveURL(/\/plan\/compare\?/);
  await expect(page.getByTestId("compare-page")).toBeVisible();
  await expect(page.getByTestId("compare-scenario-card-1")).toContainText(
    "$55,000",
  );
  await expect(page.getByTestId("compare-chart")).toBeVisible();

  await page.getByTestId("site-header-nav-learn").click();
  await expect(page).toHaveURL(/\/learn$/);
  await expect(page.getByTestId("learn-card-fire-basics")).toBeVisible();

  await page.getByTestId("learn-card-swr").click();
  await expect(page).toHaveURL(/\/learn\/swr$/);
  await expect(
    page.getByRole("heading", { name: "Safe withdrawal rates" }),
  ).toBeVisible();
});
