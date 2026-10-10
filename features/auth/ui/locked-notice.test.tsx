import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

// The component under test is loaded when the test runs, so a build where it
// is missing fails this test and leaves the suite loadable.
async function loadLockedNotice() {
  const specifier = "./locked-notice";
  return (await import(/* @vite-ignore */ specifier)) as {
    LockedNotice: () => React.ReactNode;
  };
}

describe("locked-notice", () => {
  it("story-accounts-sign-in-sessions-ac-3 (message): After five failed password sign-ins in a row, password sign-in on that account is refused for 15 minutes with the locked message. [F-accounts-6] [bb-sign-in-3]", async () => {
    // [F-accounts-6] [bb-sign-in-3]
    const { LockedNotice } = await loadLockedNotice();

    render(<LockedNotice />);

    // The design's locked message: what happened, for how long, and that the
    // lockout covers password sign-in only.
    expect(
      screen.getByText(
        /Password sign-in is paused for this account for 15 minutes after five failed attempts\./,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/GitHub or Google/)).toBeInTheDocument();
    // Reset stays on offer; it lands on a 404 until password reset ships.
    expect(screen.getByText("Reset password")).toBeInTheDocument();
  });
});
