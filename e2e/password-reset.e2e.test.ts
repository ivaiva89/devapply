import { expect, test } from "@playwright/test";

// The auth backend needs Neon and Resend, so these flows stub /api/auth at the
// network edge and drive the real production build of the pages. The new
// password form needs a stored token, which only a database can hold: that
// page is covered with a real in-memory Postgres in its co-located test.

test("forgot password posts the address and replaces the form with one status line", async ({
  page,
}) => {
  let body: Record<string, unknown> = {};
  await page.route("**/api/auth/request-password-reset", async (route) => {
    body = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status: true }),
    });
  });

  await page.goto("/forgot-password");
  await expect(page).toHaveTitle("Reset your password · DevApply");
  await page.getByLabel("Email").fill("ada@example.com");
  await page.getByRole("button", { name: "Send reset link" }).click();

  await expect(page.getByRole("status")).toContainText(
    "If ada@example.com has an account, we sent a reset link to it. The link works once and expires in one hour.",
  );
  expect(body["email"]).toBe("ada@example.com");
  await expect(page.getByLabel("Email")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Send reset link" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Back to sign in" }),
  ).toBeVisible();
  await expect(page.locator("p[role=alert]")).toHaveCount(0);
});

test("forgot password with an invalid address sends nothing", async ({
  page,
}) => {
  let requests = 0;
  await page.route("**/api/auth/**", async (route) => {
    requests += 1;
    await route.abort();
  });

  await page.goto("/forgot-password");
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByRole("button", { name: "Send reset link" }).click();

  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  expect(requests).toBe(0);
});

test("forgot password keeps the form and shows the server's message when refused", async ({
  page,
}) => {
  await page.route("**/api/auth/request-password-reset", async (route) => {
    await route.fulfill({
      status: 429,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Too many requests. Please try again later.",
      }),
    });
  });

  await page.goto("/forgot-password");
  await page.getByLabel("Email").fill("ada@example.com");
  await page.getByRole("button", { name: "Send reset link" }).click();

  await expect(page.locator("p[role=alert]")).toContainText(
    "Too many requests",
  );
  await expect(page.getByLabel("Email")).toHaveValue("ada@example.com");
  await expect(page.getByRole("status")).toBeEmpty();
});

test("forgot password shows the fallback line when no answer comes back", async ({
  page,
}) => {
  await page.route("**/api/auth/request-password-reset", async (route) => {
    await route.abort("connectionreset");
  });

  await page.goto("/forgot-password");
  await page.getByLabel("Email").fill("ada@example.com");
  await page.getByRole("button", { name: "Send reset link" }).click();

  await expect(page.locator("p[role=alert]")).toHaveText(
    "We couldn't send the link. Try again.",
  );
  await expect(page.getByRole("status")).toBeEmpty();
});

test("a reset link with no token shows the expired screen, and Send a new link leads to forgot password", async ({
  page,
}) => {
  await page.goto("/reset-password");

  await expect(page).toHaveTitle("Set a new password · DevApply");
  await expect(
    page.getByRole("heading", { name: "This link has expired" }),
  ).toBeVisible();
  await expect(page.getByLabel("New password")).toHaveCount(0);

  await page.getByRole("link", { name: "Send a new link" }).click();
  await expect(page).toHaveURL(/\/forgot-password$/);
});

test("a reset link with an empty token shows the expired screen", async ({
  page,
}) => {
  await page.goto("/reset-password?token=");

  await expect(
    page.getByRole("heading", { name: "This link has expired" }),
  ).toBeVisible();
});
