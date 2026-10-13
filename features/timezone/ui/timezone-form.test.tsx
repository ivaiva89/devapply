import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// The external boundaries are the framework's router and the server action
// the form calls: a call across the network in the running app. The form and
// its picker run for real.
const updateTimezone = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/settings",
}));
vi.mock("@/features/timezone/api/update-timezone", () => ({ updateTimezone }));

interface TimezoneFormModule {
  TimezoneForm: (props: { timezone: string | null }) => ReactNode;
}

async function load(): Promise<TimezoneFormModule> {
  const specifier = "./timezone-form";
  return (await import(/* @vite-ignore */ specifier)) as TimezoneFormModule;
}

// Everything on screen that a screen reader announces, with its text.
function announcements(container: HTMLElement): string[] {
  return Array.from(
    container.querySelectorAll(
      '[role="alert"], [aria-live="polite"], [aria-live="assertive"]',
    ),
  )
    .map((node) => node.textContent?.trim() ?? "")
    .filter((text) => text.length > 0);
}

beforeEach(() => {
  updateTimezone.mockReset();
  updateTimezone.mockResolvedValue({ ok: true });
});

describe("timezone-form", () => {
  it("story-accounts-timezone-settings-ac-8 (shows the timezone): Settings shows the account's timezone, `UTC` included. [F-accounts-14] [bb-sign-in-5] [bb-sign-in-13]", async () => {
    // [F-accounts-14] [bb-sign-in-5] [bb-sign-in-13]
    const { TimezoneForm } = await load();

    const { unmount } = render(<TimezoneForm timezone="Europe/Berlin" />);
    expect(screen.getByLabelText(/^timezone/i)).toHaveValue("Europe/Berlin");
    unmount();

    render(<TimezoneForm timezone="UTC" />);
    expect(screen.getByLabelText(/^timezone/i)).toHaveValue("UTC");
  });

  it("story-accounts-timezone-settings-ac-8 (saves a change): Picking another zone and pressing Save sends that zone. [F-accounts-14] [bb-sign-in-5] [bb-sign-in-13]", async () => {
    // [F-accounts-14] [bb-sign-in-5] [bb-sign-in-13]
    const { TimezoneForm } = await load();
    const user = userEvent.setup();
    render(<TimezoneForm timezone="Europe/Berlin" />);

    await user.selectOptions(screen.getByLabelText(/^timezone/i), "Asia/Tokyo");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(updateTimezone).toHaveBeenCalledTimes(1));
    expect(updateTimezone).toHaveBeenCalledWith("Asia/Tokyo");
    expect(screen.getByLabelText(/^timezone/i)).toHaveValue("Asia/Tokyo");
  });

  it("story-accounts-timezone-settings-ac-9 (field error): When the server refuses the zone, Settings shows a field error next to the picker. [F-accounts-13] [F-accounts-14]", async () => {
    // [F-accounts-13] [F-accounts-14]
    updateTimezone.mockResolvedValue({
      ok: false,
      error: "Choose a timezone from the list.",
    });
    const { TimezoneForm } = await load();
    const user = userEvent.setup();
    const { container } = render(<TimezoneForm timezone="Europe/Berlin" />);

    await user.selectOptions(screen.getByLabelText(/^timezone/i), "Asia/Tokyo");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(announcements(container)).toContain(
        "Choose a timezone from the list.",
      ),
    );
    expect(screen.getByLabelText(/^timezone/i)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
