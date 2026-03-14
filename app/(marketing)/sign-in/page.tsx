import { PageShell } from "@/components/layout/page-shell";
import { SignInForm } from "@/features/auth/components/sign-in-form";

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-xl">
      <PageShell
        eyebrow="Sign In"
        title="Access the job tracker workspace."
        description="This MVP auth boundary uses an existing seeded user and a server-issued session cookie. It keeps the protected app area closed while the full production auth provider is still pending."
      >
        <div className="mt-8 rounded-3xl border border-stone-200 bg-stone-50 p-6">
          <SignInForm />
        </div>
      </PageShell>
    </div>
  );
}
