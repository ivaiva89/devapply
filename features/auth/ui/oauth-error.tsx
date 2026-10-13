import type { ReactNode } from "react";

// What a social sign-in that did not finish came back to /sign-in with: the
// `error` code, and the provider whose button was pressed.
export interface OAuthFailure {
  code: string;
  provider?: string;
}

// The codes that come back in `error`. The first is the provider's own, for a
// visitor who pressed cancel there; the other two are Better Auth's.
const CANCELLED = "access_denied";
const LINK_REFUSED = "account_not_linked";
const NO_EMAIL = "email_not_found";

function providerName(provider: string | undefined): string | null {
  if (provider === "github") return "GitHub";
  if (provider === "google") return "Google";
  return null;
}

function messageFor({ code, provider }: OAuthFailure): string | null {
  // Cancelling is the visitor's own choice and needs no telling.
  if (code === CANCELLED) return null;
  if (code === LINK_REFUSED) {
    return "An account with this email already exists. Sign in the way you did before.";
  }
  // The other messages name the provider, so without one there is none.
  const name = providerName(provider);
  if (!name) return null;
  if (code === NO_EMAIL) {
    return `We couldn't get an email address from ${name}. Sign in with email and password instead.`;
  }
  return `Sign-in with ${name} didn't finish. Try again.`;
}

export function OAuthError({ code, provider }: OAuthFailure): ReactNode {
  const message = messageFor({ code, provider });
  if (!message) return null;

  return (
    <p
      role="alert"
      className="bg-danger-soft text-danger rounded-card mb-4 px-3 py-[10px] text-[13px] leading-[1.5]"
    >
      {message}
    </p>
  );
}
