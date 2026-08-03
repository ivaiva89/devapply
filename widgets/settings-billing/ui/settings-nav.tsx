"use client";

import { useEffect, useState } from "react";

import { cn } from "@/shared/lib/utils";

const SECTIONS = [
  { id: "account", label: "Account" },
  { id: "appearance", label: "Appearance" },
  { id: "plan", label: "Plan & billing" },
] as const;

export function SettingsNav() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    for (const section of SECTIONS) {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, []);

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ): void => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  return (
    <nav
      aria-label="Settings sections"
      className="flex flex-col gap-0.5 lg:sticky lg:top-6"
    >
      {SECTIONS.map((section) => {
        const isActive = activeId === section.id;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={(event) => handleClick(event, section.id)}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "rounded-button px-2.5 py-1.5 text-[13px] transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
              isActive
                ? "bg-surface-1 font-medium text-text"
                : "text-text-3 hover:text-text",
            )}
          >
            {section.label}
          </a>
        );
      })}
    </nav>
  );
}
