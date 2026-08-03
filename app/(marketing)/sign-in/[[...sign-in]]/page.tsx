import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

type SignInPageProps = {
  searchParams?: Promise<{
    auth_error?: string | string[] | undefined;
  }>;
};

function getAuthErrorMessage(value: string | undefined) {
  switch (value) {
    case "email_already_linked":
      return "This email is already linked to another account. Sign in with the original provider or use a different email.";
    case "missing_email":
      return "Your Clerk account needs a valid email address before DevApply can create your workspace.";
    default:
      return null;
  }
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const authError = Array.isArray(resolvedSearchParams?.auth_error)
    ? resolvedSearchParams.auth_error[0]
    : resolvedSearchParams?.auth_error;
  const authErrorMessage = getAuthErrorMessage(authError);

  return (
    <div className="py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-card border border-border bg-surface md:grid-cols-[1.2fr_1fr]">
        {/* ── Branded left panel ── */}
        <div
          className="relative flex flex-col gap-6 overflow-hidden border-b border-border bg-surface-1 p-10 sm:p-14 md:border-b-0 md:border-r"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 600px 400px at 20% 90%, color-mix(in srgb, var(--primary) 10%, transparent), transparent 60%)",
            }}
            aria-hidden
          />
          <div className="relative flex items-center gap-2.5 text-base font-bold text-text">
            <span
              className="grid size-7 place-items-center rounded-input font-mono text-[13px] font-bold text-canvas"
              style={{
                background:
                  "linear-gradient(135deg, var(--text) 0%, var(--text-2) 100%)",
              }}
              aria-hidden
            >
              {"{}"}
            </span>
            DevApply
          </div>

          <h1 className="relative max-w-md text-4xl font-bold leading-tight tracking-tight text-text">
            The job tracker that keeps up with{" "}
            <span className="text-primary">your terminal.</span>
          </h1>

          <div className="relative mt-auto flex flex-col gap-2 rounded-card border border-border bg-surface p-4 font-mono text-sm text-text-2">
            <div className="flex items-center gap-2">
              <span className="text-text-4">$</span>
              <span>devapply apply stripe/platform-engineer</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-4">→</span>
              <span className="text-primary">saved · ⌘P to open pipeline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-4">$</span>
              <span>devapply next</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-4">→</span>
              <span>Stripe interview · 2 PM · prep link ready</span>
            </div>
          </div>
        </div>

        {/* ── Form panel — real Clerk sign-in ── */}
        <div className="flex flex-col justify-center gap-5 p-10 sm:p-14">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-text">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-text-3">
              Sign in to continue tracking.{" "}
              <Link href="/sign-up" className="text-primary hover:underline">
                New here? Create an account →
              </Link>
            </p>
          </div>

          {authErrorMessage ? (
            <div className="rounded-card border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
              {authErrorMessage}
            </div>
          ) : null}

          <SignIn
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
            forceRedirectUrl="/dashboard"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
}
