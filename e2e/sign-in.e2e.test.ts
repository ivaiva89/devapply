import { expect, test, type Page } from "@playwright/test";

// The auth backend needs Neon, so these flows stub /api/auth at the network
// edge and drive the real production build of the pages and of proxy.ts.

async function stubSignIn(
  page: Page,
  status: number,
  body: Record<string, unknown>,
): Promise<void> {
  await page.route("**/api/auth/sign-in/email", async (route) => {
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
}

async function submit(page: Page, email: string): Promise<void> {
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("correct horse battery");
  await page.getByRole("button", { name: "Sign in" }).click();
}

test("a signed-out visitor on an app route is sent to /sign-in with the route to return to", async ({
  page,
}) => {
  await page.goto("/settings/profile?tab=a");

  await expect(page).toHaveURL(/\/sign-in\?returnTo=/);
  const returnTo = new URL(page.url()).searchParams.get("returnTo");
  expect(returnTo).toBe("/settings/profile?tab=a");
});

test("an address the app does not have stays a 404 for a signed-out visitor", async ({
  page,
}) => {
  const response = await page.goto("/no-such-page");

  expect(response?.status()).toBe(404);
  expect(new URL(page.url()).pathname).toBe("/no-such-page");
});

test("a wrong password shows one message that names neither field", async ({
  page,
}) => {
  await stubSignIn(page, 401, {
    code: "INVALID_EMAIL_OR_PASSWORD",
    message: "Invalid email or password",
  });

  await page.goto("/sign-in");
  await submit(page, "ada@example.com");

  await expect(page.locator("p[role=alert]")).toHaveText(
    "Wrong email or password.",
  );
  expect(new URL(page.url()).pathname).toBe("/sign-in");
});

test("a locked account shows the locked notice with reset on offer and no form", async ({
  page,
}) => {
  await stubSignIn(page, 423, {
    code: "SIGN_IN_LOCKED",
    message: "Password sign-in is paused for this account.",
  });

  await page.goto("/sign-in");
  await submit(page, "ada@example.com");

  await expect(page.locator("p[role=alert]")).toContainText(
    "paused for this account for 15 minutes",
  );
  await expect(
    page.getByRole("link", { name: "Reset password" }),
  ).toBeVisible();
  await expect(page.getByLabel("Password")).toHaveCount(0);
});

test("a successful sign-in returns the visitor to the route they asked for", async ({
  page,
}) => {
  await stubSignIn(page, 200, { token: "t", user: { id: "u1" } });

  await page.goto("/sign-in?returnTo=%2Fsign-up%3Fx%3D1");
  await submit(page, "ada@example.com");

  await expect(page).toHaveURL(/\/sign-up\?x=1$/);
});

test("a return path pointing off-site is ignored", async ({ page }) => {
  await stubSignIn(page, 200, { token: "t", user: { id: "u1" } });
  const offSite: string[] = [];
  await page.route("https://evil.example/**", async (route) => {
    offSite.push(route.request().url());
    await route.abort();
  });

  await page.goto("/sign-in?returnTo=https%3A%2F%2Fevil.example%2Fphish");
  await submit(page, "ada@example.com");
  // The stub sets no session cookie, so the route gate bounces the default
  // route back to sign-in carrying "/": proof the off-site path was dropped.
  await expect(page).toHaveURL(/\/sign-in\?returnTo=%2F$/);

  expect(offSite).toEqual([]);
  expect(new URL(page.url()).origin).toBe(
    new URL("http://localhost:3100").origin,
  );
});

test("at 390px the sign-in page is a white page with 44px touch targets", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: "dark",
  });
  const page = await context.newPage();

  await page.goto("/sign-in");

  await expect(
    page.getByRole("heading", { name: "Sign in", exact: true }),
  ).toBeVisible();
  const bodyBackground = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  expect(bodyBackground).toBe("rgb(255, 255, 255)");
  for (const target of [
    page.getByLabel("Email"),
    page.getByLabel("Password"),
    page.getByRole("button", { name: "Sign in" }),
  ]) {
    const box = await target.boundingBox();
    expect(box?.height).toBe(44);
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  await context.close();
});

test.describe("a social sign-in that did not finish", () => {
  const cases: Array<{ query: string; message: string | null }> = [
    {
      query: "provider=github&error=email_not_found",
      message:
        "We couldn't get an email address from GitHub. Sign in with email and password instead.",
    },
    {
      query: "provider=google&error=email_not_found",
      message:
        "We couldn't get an email address from Google. Sign in with email and password instead.",
    },
    {
      query: "provider=github&error=account_not_linked",
      message:
        "An account with this email already exists. Sign in the way you did before.",
    },
    {
      query: "provider=google&error=server_error",
      message: "Sign-in with Google didn't finish. Try again.",
    },
    { query: "provider=github&error=access_denied", message: null },
    { query: "provider=nope&error=server_error", message: null },
  ];

  for (const { query, message } of cases) {
    test(`/sign-in?${query} shows ${message ?? "no message"}`, async ({
      page,
    }) => {
      await page.goto(`/sign-in?${query}`);

      if (message) {
        await expect(page.locator("p[role=alert]")).toHaveText(message);
      } else {
        await expect(page.locator("p[role=alert]")).toHaveCount(0);
      }
    });
  }
});

test.describe("edge cases", () => {
  test("a retry after a failed social sign-in returns to the kept route", async ({
    page,
  }) => {
    await stubSignIn(page, 200, { token: "t", user: { id: "u1" } });

    await page.goto(
      "/sign-in?provider=github&error=server_error&returnTo=%2Fsettings%2Fprofile",
    );
    await expect(page.locator("p[role=alert]")).toHaveText(
      "Sign-in with GitHub didn't finish. Try again.",
    );
    await submit(page, "ada@example.com");

    // No session cookie from the stub, so the route gate bounces back to sign
    // in carrying the route the retry went to.
    await expect(page).toHaveURL(/\/sign-in\?returnTo=%2Fsettings%2Fprofile$/);
  });

  test("an off-site route kept with a failed social sign-in is dropped on retry", async ({
    page,
  }) => {
    await stubSignIn(page, 200, { token: "t", user: { id: "u1" } });

    await page.goto(
      "/sign-in?provider=google&error=server_error&returnTo=https%3A%2F%2Fevil.example%2Fx",
    );
    await submit(page, "ada@example.com");

    await expect(page).toHaveURL(/\/sign-in\?returnTo=%2F$/);
  });
});
