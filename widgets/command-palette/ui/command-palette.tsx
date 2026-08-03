"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ClipboardList,
  Columns3,
  FileText,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { requestNewApplication } from "@/shared/lib/app-commands";

type Command = {
  id: string;
  group: "Navigate" | "Actions";
  label: string;
  hint?: string;
  icon: LucideIcon;
  run: (router: ReturnType<typeof useRouter>) => void;
};

const COMMANDS: Command[] = [
  { id: "nav-dashboard", group: "Navigate", label: "Dashboard", hint: "G D", icon: LayoutDashboard, run: (r) => r.push("/dashboard") },
  { id: "nav-pipeline", group: "Navigate", label: "Pipeline", hint: "G P", icon: Columns3, run: (r) => r.push("/pipeline") },
  { id: "nav-applications", group: "Navigate", label: "Applications", hint: "G A", icon: ClipboardList, run: (r) => r.push("/applications") },
  { id: "nav-reminders", group: "Navigate", label: "Reminders", hint: "G N", icon: Bell, run: (r) => r.push("/reminders") },
  { id: "nav-resumes", group: "Navigate", label: "Resumes", hint: "G R", icon: FileText, run: (r) => r.push("/resumes") },
  { id: "nav-settings", group: "Navigate", label: "Settings", hint: "G S", icon: Settings, run: (r) => r.push("/settings") },
  { id: "action-new-application", group: "Actions", label: "New application", hint: "⌘N", icon: Plus, run: () => requestNewApplication() },
];

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
};

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter((command) =>
      command.label.toLowerCase().includes(q),
    );
  }, [query]);

  // Reset transient state whenever the palette opens.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  function runCommand(command: Command) {
    onClose();
    command.run(router);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const command = results[activeIndex];
      if (command) runCommand(command);
    }
  }

  // Group results for section labels while keeping a flat index for keyboard nav.
  const groups = results.reduce<Record<string, { command: Command; index: number }[]>>(
    (accumulator, command, index) => {
      (accumulator[command.group] ??= []).push({ command, index });
      return accumulator;
    },
    {},
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/55 px-4 pt-20 backdrop-blur-sm"
      role="button"
      tabIndex={-1}
      aria-label="Close command palette"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-[600px] animate-modalIn overflow-hidden rounded-[12px] border border-border bg-surface shadow-lg"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
          <Search className="size-4 shrink-0 text-text-3" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search or jump to…"
            className="flex-1 bg-transparent text-[15px] text-text outline-none placeholder:text-text-4"
            aria-label="Search commands"
          />
          <kbd className="rounded border border-border bg-surface-1 px-1.5 py-0.5 font-mono text-[11px] text-text-4">
            ESC
          </kbd>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-1.5">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-text-3">
              No matching commands.
            </p>
          ) : (
            Object.entries(groups).map(([group, entries]) => (
              <div key={group}>
                <p className="px-2.5 pb-1 pt-2 font-mono text-[10.5px] uppercase tracking-[0.08em] text-text-4">
                  {group}
                </p>
                {entries.map(({ command, index }) => {
                  const Icon = command.icon;
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={command.id}
                      type="button"
                      onMouseMove={() => setActiveIndex(index)}
                      onClick={() => runCommand(command)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-button px-3 py-2 text-left text-sm transition-colors",
                        isActive ? "bg-surface-1 text-text" : "text-text-2",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-[22px] shrink-0 place-items-center rounded",
                          isActive
                            ? "bg-primary-soft text-primary"
                            : "bg-surface-2 text-text-2",
                        )}
                      >
                        <Icon className="size-3.5" aria-hidden />
                      </span>
                      <span className="flex-1">{command.label}</span>
                      {command.hint ? (
                        <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10.5px] text-text-4">
                          {command.hint}
                        </kbd>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex gap-4 border-t border-border bg-surface-1 px-4 py-2.5 font-mono text-[11px] text-text-4">
          <span>
            <b className="font-medium text-text-2">↑↓</b> navigate
          </span>
          <span>
            <b className="font-medium text-text-2">↵</b> select
          </span>
          <span>
            <b className="font-medium text-text-2">esc</b> close
          </span>
        </div>
      </div>
    </div>
  );
}
