"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/shared/lib/utils";

const THEME_OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
] as const;

export function AppearanceCard() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  // next-themes resolves the active theme on the client only; wait for mount
  // so the selected state matches the DOM and avoids a hydration mismatch.
  useEffect(() => setIsMounted(true), []);

  return (
    <section
      id="appearance"
      className="scroll-mt-6 overflow-hidden rounded-card border border-border bg-surface"
    >
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-[15px] font-semibold text-text">Appearance</h2>
        <p className="mt-1 text-[12.5px] text-text-3">
          Choose how DevApply looks. System follows your operating system.
        </p>
      </div>
      <div className="p-5">
        <div
          role="radiogroup"
          aria-label="Theme"
          className="grid grid-cols-3 gap-2 sm:max-w-md"
        >
          {THEME_OPTIONS.map(({ value, label, Icon }) => {
            const isSelected = isMounted && theme === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setTheme(value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-button border p-4 text-[13px] transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                  isSelected
                    ? "border-primary bg-primary-soft text-text"
                    : "border-border bg-surface-1 text-text-2 hover:border-border-strong hover:text-text",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
