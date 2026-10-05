import { expect, test } from "@playwright/test";

const light: Record<string, string> = {
  "--canvas": "#ffffff",
  "--surface": "#ffffff",
  "--surface-1": "#fafbfc",
  "--surface-2": "#f3f5f8",
  "--surface-3": "#e8ebf0",
  "--border": "#e4e7ec",
  "--border-strong": "#d0d5dd",
  "--text": "#0c111d",
  "--text-2": "#475467",
  "--text-3": "#667085",
  "--text-4": "#98a2b3",
  "--primary": "#3b5bdb",
  "--primary-hover": "#364fc7",
  "--primary-soft": "#eef0fc",
  "--primary-on": "#ffffff",
  "--accent": "#0d9488",
  "--accent-soft": "#e6f4f1",
  "--success": "#15803d",
  "--success-soft": "#ecfdf5",
  "--warning": "#d97706",
  "--warning-soft": "#fff7ed",
  "--danger": "#dc2626",
  "--danger-soft": "#fef2f2",
  "--info": "#0369a1",
  "--info-soft": "#eff6ff",
  "--focus": "#3b5bdb",
};

const dark: Record<string, string> = {
  "--canvas": "#0b0d12",
  "--surface": "#0d1017",
  "--surface-1": "#12151c",
  "--surface-2": "#171b24",
  "--surface-3": "#1d222d",
  "--border": "#232834",
  "--border-strong": "#30374a",
  "--text": "#e6eaf2",
  "--text-2": "#a1a8b8",
  "--text-3": "#7d869c",
  "--text-4": "#5a6478",
  "--primary": "#7c8cf0",
  "--primary-hover": "#8d9cf4",
  "--primary-soft": "rgba(124, 140, 240, 0.12)",
  "--primary-on": "#0b0d12",
  "--accent": "#2dd4bf",
  "--accent-soft": "rgba(45, 212, 191, 0.12)",
  "--success": "#4ade80",
  "--success-soft": "rgba(74, 222, 128, 0.12)",
  "--warning": "#fbbf24",
  "--warning-soft": "rgba(251, 191, 36, 0.12)",
  "--danger": "#f87171",
  "--danger-soft": "rgba(248, 113, 113, 0.12)",
  "--info": "#60a5fa",
  "--info-soft": "rgba(96, 165, 250, 0.12)",
  "--focus": "#7c8cf0",
};

const lengths: Record<string, string> = {
  "--radius-1": "4px",
  "--radius-2": "6px",
  "--radius-3": "8px",
  "--radius-4": "10px",
  "--radius-5": "12px",
  "--radius-6": "16px",
  "--radius-button": "6px",
  "--radius-input": "6px",
  "--radius-card": "8px",
  "--space-1": "4px",
  "--space-2": "8px",
  "--space-3": "12px",
  "--space-4": "16px",
  "--space-5": "20px",
  "--space-6": "24px",
  "--space-8": "32px",
  "--space-10": "40px",
  "--space-12": "48px",
  "--space-16": "64px",
  "--space-20": "80px",
};

function toRgb(value: string): string {
  const hex = /^#([0-9a-f]{6})$/.exec(value);
  if (!hex?.[1]) return value;
  const n = parseInt(hex[1], 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}

// Resolves each token through a probe element, so the browser normalises
// hex, rgba and minified spellings the same way on both sides.
async function resolvedColors(
  page: import("@playwright/test").Page,
  names: string[],
): Promise<Record<string, string>> {
  return page.evaluate((tokens) => {
    const probe = document.createElement("div");
    document.body.appendChild(probe);
    const out: Record<string, string> = {};
    for (const name of tokens) {
      probe.style.backgroundColor = "";
      probe.style.backgroundColor = `var(${name})`;
      out[name] = getComputedStyle(probe).backgroundColor;
    }
    probe.remove();
    return out;
  }, names);
}

test("story-accounts-app-scaffold-ac-1: the production build serves the app and / redirects to /sign-in", async ({
  page,
  request,
}) => {
  const response = await page.goto("/");
  expect(new URL(page.url()).pathname).toBe("/sign-in");
  // /sign-in has no screen yet: Next's own 404 answers.
  expect(response?.status()).toBe(404);

  const root = await request.get("/", { maxRedirects: 0 });
  expect(root.status()).toBe(307);
  expect(root.headers()["location"]).toContain("/sign-in");
});

test("story-accounts-app-scaffold-ac-2: the light tokens carry the design-system values", async ({
  page,
}) => {
  await page.goto("/sign-in");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  const expectedRgb = Object.fromEntries(
    Object.entries(light).map(([name, value]) => [name, toRgb(value)]),
  );
  expect(await resolvedColors(page, Object.keys(light))).toEqual(expectedRgb);

  const measured = await page.evaluate((tokens) => {
    const probe = document.createElement("div");
    document.body.appendChild(probe);
    const out: Record<string, string> = {};
    for (const name of Object.keys(tokens)) {
      probe.style.width = "";
      probe.style.width = `var(${name})`;
      out[name] = getComputedStyle(probe).width;
    }
    probe.remove();
    return out;
  }, lengths);
  expect(measured).toEqual(lengths);
});

test("story-accounts-app-scaffold-ac-2: the dark tokens carry the design-system values", async ({
  page,
}) => {
  await page.goto("/sign-in");
  await page.evaluate(() =>
    document.documentElement.setAttribute("data-theme", "dark"),
  );

  const expectedRgb = (await page.evaluate((tokens) => {
    const probe = document.createElement("div");
    document.body.appendChild(probe);
    const out: Record<string, string> = {};
    for (const [name, value] of Object.entries(tokens)) {
      probe.style.backgroundColor = "";
      probe.style.backgroundColor = value;
      out[name] = getComputedStyle(probe).backgroundColor;
    }
    probe.remove();
    return out;
  }, dark)) as Record<string, string>;

  expect(await resolvedColors(page, Object.keys(dark))).toEqual(expectedRgb);
});

test.describe("under an OS-dark preference", () => {
  test.use({ colorScheme: "dark" });

  test("story-accounts-app-scaffold-ac-2: the app stays pinned to the light tokens", async ({
    page,
  }) => {
    await page.goto("/");
    expect(new URL(page.url()).pathname).toBe("/sign-in");

    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "light");
    await expect(html).toHaveCSS("background-color", "rgb(255, 255, 255)");
    expect(
      await page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue("--canvas")
          .trim(),
      ),
    ).toMatch(/^#(fff|ffffff)$/);
  });
});

test("story-accounts-app-scaffold-ac-5: pnpm e2e drives the production build on its own port", async ({
  page,
  baseURL,
}) => {
  expect(baseURL).toBe("http://localhost:3100");
  const response = await page.goto("/sign-in");
  const html = (await response?.text()) ?? "";
  expect(html).toContain("/_next/static/");
  // A dev server serves its chunks from /_next/static/development.
  expect(html).not.toContain("/_next/static/development");
});
