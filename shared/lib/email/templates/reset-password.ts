import type { EmailContent } from "./confirm-email";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// The plain reset email. The link opens /reset-password, whose button saves
// the new password: opening the link alone changes nothing and uses nothing up.
export function resetPasswordTemplate(link: string): EmailContent {
  const href = escapeHtml(link);
  return {
    subject: "Reset your DevApply password",
    text: [
      "Someone asked to reset the password for your DevApply account.",
      "",
      "Open this link and press Save new password:",
      link,
      "",
      "The link works once and expires one hour after it was sent.",
      "",
      "If you did not ask for this, ignore this email. Your password stays the same.",
    ].join("\n"),
    html: [
      "<p>Someone asked to reset the password for your DevApply account.</p>",
      `<p><a href="${href}">Open the reset page</a> and press Save new password.</p>`,
      `<p>Or paste this link into your browser:<br>${href}</p>`,
      "<p>The link works once and expires one hour after it was sent.</p>",
      "<p>If you did not ask for this, ignore this email. Your password stays the same.</p>",
    ].join("\n"),
  };
}
