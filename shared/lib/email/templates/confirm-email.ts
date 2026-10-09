export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// The plain confirmation email. The link opens /confirm-email, whose button
// confirms the address: opening the link alone confirms nothing.
export function confirmEmailTemplate(link: string): EmailContent {
  const href = escapeHtml(link);
  return {
    subject: "Confirm your email for DevApply",
    text: [
      "Confirm your email to finish creating your DevApply account.",
      "",
      "Open this link and press Confirm email:",
      link,
      "",
      "If you did not sign up for DevApply, ignore this email.",
    ].join("\n"),
    html: [
      "<p>Confirm your email to finish creating your DevApply account.</p>",
      `<p><a href="${href}">Open the confirmation page</a> and press Confirm email.</p>`,
      `<p>Or paste this link into your browser:<br>${href}</p>`,
      "<p>If you did not sign up for DevApply, ignore this email.</p>",
    ].join("\n"),
  };
}
