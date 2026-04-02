import { SignUp } from "@clerk/nextjs";

import { PageShell } from "@/shared/layout/page-shell";

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-xl">
      <PageShell
        eyebrow="Sign Up"
        title="Create your DevApply account."
        description="Set up your account to start tracking applications, reminders, and resume versions inside the protected workspace."
      >
        <div className="mt-8 rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm">
          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            forceRedirectUrl="/dashboard"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </PageShell>
    </div>
  );
}
