import type { ReactNode } from "react";

// The centred auth card every sign-up and sign-in screen sits in: the
// wordmark above a 400px card.
interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps): ReactNode {
  return (
    <main className="bg-surface-1 flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <p className="text-text mb-5 text-[18px] font-semibold">DevApply</p>
      <div className="border-border bg-surface rounded-card w-full max-w-[400px] border p-7">
        {children}
      </div>
    </main>
  );
}
