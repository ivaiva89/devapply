import { SignIn } from "@clerk/nextjs";

import { PageShell } from "@/shared/layout/page-shell";

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
    <div className="mx-auto max-w-xl">
      <PageShell
        eyebrow="Sign In"
        title="Access the job tracker workspace."
        description="Sign in with your DevApply account to manage applications, reminders, and resume versions in the protected workspace."
      >
        <div className="mt-8 rounded-3xl border border-border/70 bg-card/80 p-6 shadow-sm">
          {authErrorMessage ? (
            <div className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
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
      </PageShell>
    </div>
  );
}
