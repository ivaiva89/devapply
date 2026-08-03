/**
 * App-wide command channel. Lets any surface (command palette, page buttons,
 * hotkeys) request the global "new application" modal without prop drilling.
 */
export const NEW_APPLICATION_EVENT = "devapply:new-application";

export function requestNewApplication(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(NEW_APPLICATION_EVENT));
}
