"use client";

import { useEffect, useState } from "react";

import { ApplicationFormModal } from "@/features/applications/components/application-form-modal";
import { createApplicationDefaultValues } from "@/features/applications/create-application-form";
import { createApplication } from "@/features/applications/server/create-application";
import { CommandPalette } from "@/widgets/command-palette/ui/command-palette";
import {
  NEW_APPLICATION_EVENT,
  OPEN_COMMAND_PALETTE_EVENT,
} from "@/shared/lib/app-commands";

/**
 * Global command surface mounted once in the authenticated layout. Owns the
 * ⌘K command palette and the app-wide "new application" modal, which both ⌘N
 * and the NEW_APPLICATION_EVENT (dispatched by page buttons / the palette) open.
 */
export function AppCommandLayer() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [newApplicationOpen, setNewApplicationOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const meta = event.metaKey || event.ctrlKey;
      if (!meta) return;
      const key = event.key.toLowerCase();
      if (key === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      } else if (key === "n") {
        // Best-effort — some browsers reserve ⌘N; the palette + button are the
        // guaranteed paths.
        event.preventDefault();
        setNewApplicationOpen(true);
      }
    }
    function handleNewApplication() {
      setNewApplicationOpen(true);
    }
    function handleOpenPalette() {
      setPaletteOpen(true);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener(NEW_APPLICATION_EVENT, handleNewApplication);
    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, handleOpenPalette);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener(NEW_APPLICATION_EVENT, handleNewApplication);
      window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, handleOpenPalette);
    };
  }, []);

  return (
    <>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      {newApplicationOpen ? (
        <ApplicationFormModal
          action={createApplication}
          description="Add a new application without leaving the current page."
          initialValues={createApplicationDefaultValues}
          isOpen={newApplicationOpen}
          onCancel={() => setNewApplicationOpen(false)}
          onSuccess={() => setNewApplicationOpen(false)}
          submitLabel="Create application"
          submittingLabel="Saving..."
          title="New application"
        />
      ) : null}
    </>
  );
}
