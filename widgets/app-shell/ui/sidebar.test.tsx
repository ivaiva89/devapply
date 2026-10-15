import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

// The framework's view of the current route is the only boundary.
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

interface SidebarModule {
  Sidebar: () => ReactNode;
}

async function load(): Promise<SidebarModule> {
  const specifier = "./sidebar";
  return (await import(/* @vite-ignore */ specifier)) as SidebarModule;
}

describe("sidebar", () => {
  it("story-accounts-timezone-settings-ac-12 (sidebar): The sidebar lists Settings only, with the wordmark linking to `/`. [bb-sign-in-22]", async () => {
    // [bb-sign-in-22]
    // The design draws seven links; the other six arrive with their features.
    const { Sidebar } = await load();
    render(<Sidebar />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "DevApply" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
      "href",
      "/settings",
    );
    for (const later of [
      "Dashboard",
      "Applications",
      "Pipeline",
      "Interviews",
      "Reminders",
      "Resumes",
    ]) {
      expect(screen.queryByRole("link", { name: later }), later).toBeNull();
    }
  });
});
