import type { ReactNode } from "react";

// The shell every sign-up and sign-in screen sits in. From sm up: the wordmark
// centred above a 400px card. Below sm: a white page with no card, the
// wordmark left-aligned and the content starting from the top.
interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps): ReactNode {
  return (
    <main className="bg-canvas sm:bg-surface-1 flex min-h-screen flex-col px-5 py-12 sm:items-center sm:justify-center sm:px-4">
      <p className="text-text mb-3 text-[18px] font-semibold sm:mb-5">
        DevApply
      </p>
      {/* p-7 has no token and would resolve against the 14px root, so the
          design's 28px is written out. */}
      <div className="sm:border-border sm:bg-surface sm:rounded-card w-full sm:max-w-[400px] sm:border sm:p-[28px]">
        {children}
      </div>
    </main>
  );
}
