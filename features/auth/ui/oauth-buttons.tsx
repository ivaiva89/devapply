"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

import { authClient } from "@/shared/lib/auth/client";
import type { SocialProvider } from "@/shared/lib/auth/offered-providers";

interface OAuthButtonsProps {
  // The providers this environment offers, in the order shown.
  providers: SocialProvider[];
  // Where a sign-in that finishes lands. Asked on the press, since the
  // sign-in form's answer needs the browser's address. Left out, it is the
  // app's default route.
  callbackURL?: () => string;
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

export function OAuthButtons({
  providers,
  callbackURL,
}: OAuthButtonsProps): ReactNode {
  const [isStarting, setIsStarting] = useState(false);

  async function start(provider: SocialProvider): Promise<void> {
    // A second press while the first is in flight sends nothing.
    if (isStarting) return;
    setIsStarting(true);
    // Better Auth answers with the provider's page and the browser goes there.
    await authClient.signIn.social({
      provider,
      callbackURL: callbackURL?.() ?? DEFAULT_ROUTE,
      // A sign-in that does not finish comes back to the sign-in page with
      // Better Auth's `error` code. That code does not say whose button was
      // pressed, so the provider's name goes with it.
      errorCallbackURL: `/sign-in?provider=${provider}`,
    });
    setIsStarting(false);
  }

  if (providers.length === 0) return null;

  return (
    <div className="mb-4 flex flex-col gap-4">
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
      <div className="flex items-center gap-3">
        <span className="bg-border h-px flex-1" />
        <span className="text-text-4 text-[12px]">or</span>
        <span className="bg-border h-px flex-1" />
      </div>
    </div>
  );
}
