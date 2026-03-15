import { SignUp } from "@clerk/nextjs";

import { PageShell } from "@/components/layout/page-shell";

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-xl">
      <PageShell
        eyebrow="Sign Up"
        title="Create your DevApply account."
        description="Set up your account to start tracking applications, reminders, and resume versions inside the protected workspace."
      >
        <div className="mt-8 rounded-3xl border border-stone-200 bg-stone-50 p-6">
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
