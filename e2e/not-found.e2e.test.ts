import { expect, test } from "@playwright/test";

test.describe("under an OS-dark preference", () => {
  test.use({ colorScheme: "dark" });

  test("story-app-not-found-page-ac-1: an unmatched address answers 404 on the light canvas", async ({
    page,
  }) => {
    const response = await page.goto("/no-such-page");
    expect(response?.status()).toBe(404);

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)",
    );
  });
});

test("story-app-not-found-page-ac-1: an unmatched address answers 404 on the light canvas without a dark preference", async ({
  page,
}) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
});

test("story-app-not-found-page-ac-2: the page says not found and its link leads to the start page", async ({
  page,
}) => {
  await page.goto("/no-such-page");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Page not found",
  );
  await expect(
    page.getByText("There is no page at this address."),
  ).toBeVisible();

  const link = page.getByRole("link", { name: "Back to the start page" });
  await expect(link).toHaveAttribute("href", "/");

  await link.click();
  // A signed-out visitor on the start page is sent to /sign-in, carrying it.
  await expect(page).toHaveURL(/\/sign-in\?returnTo=%2F$/);
});
