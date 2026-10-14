"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

import { authClient } from "@/shared/lib/auth/client";
import type { SocialProvider } from "@/shared/lib/auth/offered-providers";

import { OAuthError } from "./oauth-error";

interface OAuthButtonsProps {
  // The providers this environment offers, in the order shown.
  providers: SocialProvider[];
  // Where a sign-in that finishes lands. Asked on the press, since the
  // sign-in form's answer needs the browser's address. Left out, it is the
  // app's default route.
  callbackURL?: () => string;
  // The "or" divider under the buttons. Inside the locked notice there is no
  // form below to divide from, so the caller drops it.
  hasDivider?: boolean;
}

// The marks are the providers' own files, served as they are. `width` and
// `height` are each file's own pixels; the button shows it 16px tall.
const BUTTONS: Record<
  SocialProvider,
  { label: string; mark: string; width: number; height: number }
> = {
  github: {
    label: "Continue with GitHub",
    mark: "/brand/github.svg",
    width: 98,
    height: 96,
  },
  google: {
    label: "Continue with Google",
    mark: "/brand/google.png",
    width: 200,
    height: 204,
  },
};

const DEFAULT_ROUTE = "/";

// Not a code Better Auth sends back, so OAuthError reads it as a sign-in that
// did not finish.
const START_FAILED = "start_failed";

// Where a sign-in that does not finish comes back to: the sign-in page, with
// the provider whose button was pressed, since Better Auth's `error` code does
// not say, and the route the sign-in was going to, so a retry still gets there.
function errorCallbackURL(provider: SocialProvider, route: string): string {
  const query = new URLSearchParams({ provider });
  if (route !== DEFAULT_ROUTE) query.set("returnTo", route);
  return `/sign-in?${query.toString()}`;
}

export function OAuthButtons({
  providers,
  callbackURL,
  hasDivider = true,
}: OAuthButtonsProps): ReactNode {
  const [isStarting, setIsStarting] = useState(false);
  // The provider whose sign-in could not start, if the last press failed.
  const [failed, setFailed] = useState<SocialProvider | null>(null);

  async function start(provider: SocialProvider): Promise<void> {
    // A second press while the first is in flight sends nothing.
    if (isStarting) return;
    setIsStarting(true);
    setFailed(null);
    const route = callbackURL?.() ?? DEFAULT_ROUTE;
    // Better Auth answers with the provider's page and the browser goes there.
    // A request that throws has failed the same as one answered with an error.
    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: route,
        errorCallbackURL: errorCallbackURL(provider, route),
      });
      if (error) setFailed(provider);
    } catch {
      setFailed(provider);
    }
    setIsStarting(false);
  }

  if (providers.length === 0) return null;

  return (
    <>
      {failed ? <OAuthError code={START_FAILED} provider={failed} /> : null}
      <div
        className={
          hasDivider ? "mb-4 flex flex-col gap-4" : "flex flex-col gap-4"
        }
      >
        {providers.map((provider) => {
          const { label, mark, width, height } = BUTTONS[provider];
          return (
            <button
              key={provider}
              type="button"
              disabled={isStarting}
              onClick={() => void start(provider)}
              className="border-border-strong bg-surface text-text hover:bg-surface-2 rounded-button flex h-[44px] items-center justify-center gap-2 border text-[14px] font-medium disabled:opacity-60 sm:h-[36px]"
            >
              <Image
                src={mark}
                alt=""
                width={width}
                height={height}
                unoptimized
                className="h-4 w-auto"
              />
              {label}
            </button>
          );
        })}
        {hasDivider ? (
          <div className="flex items-center gap-3">
            <span className="bg-border h-px flex-1" />
            <span className="text-text-4 text-[12px]">or</span>
            <span className="bg-border h-px flex-1" />
          </div>
        ) : null}
      </div>
    </>
  );
}
