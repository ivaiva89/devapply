import { expect, test } from "@playwright/test";

// The auth backend needs Neon and Resend, so these flows stub /api/auth at the
// network edge and drive the real production build of the pages.

test("sign-up with an email and a password lands on /check-email naming the address", async ({
  page,
}) => {
  let body: Record<string, unknown> = {};
  await page.route("**/api/auth/sign-up/email", async (route) => {
    body = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ token: null, user: { id: "u1" } }),
    });
  });

  await page.goto("/sign-up");
  await page.getByLabel("Email").fill("ada@example.com");
  await page.getByLabel("Password").fill("correct horse battery");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/check-email\?email=ada%40example\.com$/);
  await expect(page.getByText("ada@example.com")).toBeVisible();
  expect(body["name"]).toBe("ada");
});

test("sign-up shows field errors inline and sends nothing", async ({
  page,
}) => {
  let requests = 0;
  await page.route("**/api/auth/**", async (route) => {
    requests += 1;
    await route.abort();
  });

  await page.goto("/sign-up");
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByLabel("Password").fill("short");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await expect(page.getByText("Use at least 8 characters.")).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/sign-up");
  expect(requests).toBe(0);
});

test("sign-up with an email that has an account shows an announced error", async ({
  page,
}) => {
  await page.route("**/api/auth/sign-up/email", async (route) => {
    await route.fulfill({
      status: 422,
      contentType: "application/json",
      body: JSON.stringify({
        code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
        message: "User already exists. Use another email.",
      }),
    });
  });

  await page.goto("/sign-up");
  await page.getByLabel("Email").fill("ada@example.com");
  await page.getByLabel("Password").fill("correct horse battery");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.locator("p[role=alert]")).toContainText("already exists");
  expect(new URL(page.url()).pathname).toBe("/sign-up");
});

test("Resend email sends nothing on render and posts the address when pressed", async ({
  page,
}) => {
  const sent: string[] = [];
  await page.route("**/api/auth/send-verification-email", async (route) => {
    sent.push(route.request().postData() ?? "");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status: true }),
    });
  });

  await page.goto("/check-email?email=ada%40example.com");
  await expect(page.getByText("ada@example.com")).toBeVisible();
  expect(sent).toHaveLength(0);

  await page.getByRole("button", { name: /^Resend/ }).click();
  await expect(
    page.getByText("We sent a new confirmation link."),
  ).toBeVisible();
  expect(sent).toHaveLength(1);
  expect(JSON.parse(sent[0] ?? "{}")).toMatchObject({
    email: "ada@example.com",
  });
});

test("a failed resend says so and offers Resend again", async ({ page }) => {
  await page.route("**/api/auth/send-verification-email", async (route) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: "{}",
    });
  });

  await page.goto("/check-email?email=ada%40example.com");
  await page.getByRole("button", { name: /^Resend/ }).click();

  await expect(page.locator("p[role=alert]")).toContainText(
    "couldn't send the email",
  );
  await expect(page.getByRole("button", { name: /^Resend/ })).toBeEnabled();
});

test("opening the confirmation link confirms nothing; the Confirm button does", async ({
  page,
}) => {
  const verifies: string[] = [];
  await page.route("**/api/auth/verify-email**", async (route) => {
    verifies.push(route.request().url());
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status: true }),
    });
  });

  await page.goto("/confirm-email?token=abc.def.ghi");
  await expect(
    page.getByRole("button", { name: "Confirm email" }),
  ).toBeVisible();
  expect(verifies).toHaveLength(0);

  await page.getByRole("button", { name: "Confirm email" }).click();
  await expect.poll(() => verifies.length).toBe(1);
  expect(new URL(verifies[0] ?? "").searchParams.get("token")).toBe(
    "abc.def.ghi",
  );
});

test("an expired confirmation link offers a new one", async ({ page }) => {
  await page.route("**/api/auth/verify-email**", async (route) => {
    await route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({ code: "TOKEN_EXPIRED", message: "Token expired" }),
    });
  });

  const payload = Buffer.from(
    JSON.stringify({ email: "ada@example.com" }),
  ).toString("base64url");
  await page.goto(`/confirm-email?token=h.${payload}.s`);
  await page.getByRole("button", { name: "Confirm email" }).click();

  await expect(page.getByText("This link has expired.")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Send a new link" }),
  ).toHaveAttribute("href", "/check-email?email=ada%40example.com");
});

test.describe("sign-up timezone", () => {
  async function stubSignUp(
    page: import("@playwright/test").Page,
    bodies: Record<string, unknown>[],
  ): Promise<void> {
    await page.route("**/api/auth/sign-up/email", async (route) => {
      bodies.push(route.request().postDataJSON() as Record<string, unknown>);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ token: null, user: { id: "u1" } }),
      });
    });
  }

  async function fillAndSubmit(
    page: import("@playwright/test").Page,
  ): Promise<void> {
    await page.goto("/sign-up");
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByLabel("Password").fill("correct horse battery");
    await page.getByRole("button", { name: "Create account" }).click();
  }

  test.describe("browser in Europe/Berlin", () => {
    test.use({ timezoneId: "Europe/Berlin" });

    test("sends the browser's zone with the sign-up and shows no step", async ({
      page,
    }) => {
      const bodies: Record<string, unknown>[] = [];
      await stubSignUp(page, bodies);
      await fillAndSubmit(page);

      await expect(page).toHaveURL(/\/check-email\?email=/);
      expect(bodies).toHaveLength(1);
      expect(bodies[0]?.["timezone"]).toBe("Europe/Berlin");
    });
  });

  test.describe("browser in UTC", () => {
    test.use({ timezoneId: "UTC" });

    test("asks first and sends nothing until Keep UTC is pressed", async ({
      page,
    }) => {
      const bodies: Record<string, unknown>[] = [];
      await stubSignUp(page, bodies);
      await fillAndSubmit(page);

      await expect(
        page.getByRole("heading", { name: "Confirm your timezone" }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Create your account" }),
      ).toHaveCount(0);
      expect(bodies).toHaveLength(0);

      await page.getByRole("button", { name: "Keep UTC" }).click();
      await expect(page).toHaveURL(/\/check-email\?email=/);
      expect(bodies).toHaveLength(1);
      expect(bodies[0]?.["timezone"]).toBe("UTC");
    });

    test("Continue sends the picked zone", async ({ page }) => {
      const bodies: Record<string, unknown>[] = [];
      await stubSignUp(page, bodies);
      await fillAndSubmit(page);

      await page.getByRole("combobox").selectOption("Europe/Berlin");
      await page.getByRole("button", { name: "Continue" }).click();
      await expect(page).toHaveURL(/\/check-email\?email=/);
      expect(bodies[0]?.["timezone"]).toBe("Europe/Berlin");
    });

    test("a refused sign-up returns to the form with its error", async ({
      page,
    }) => {
      await page.route("**/api/auth/sign-up/email", async (route) => {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({
            code: "INVALID_TIMEZONE",
            message: "Choose a valid timezone.",
          }),
        });
      });
      await fillAndSubmit(page);
      await page.getByRole("button", { name: "Keep UTC" }).click();

      await expect(page.locator("p[role=alert]")).toContainText(
        "Choose a valid timezone.",
      );
      expect(new URL(page.url()).pathname).toBe("/sign-up");
    });
  });
});
