import type { Metadata } from "next";

import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/support";

export const metadata: Metadata = {
  title: "Privacy Policy | DevApply",
  description:
    "Privacy policy for DevApply, the developer job application tracker.",
};

const sections = [
  {
    title: "What DevApply stores",
    body: [
      "DevApply stores the account details needed to operate the product, including your email address, profile information, application records, reminders, resume metadata, billing state, and related timestamps.",
      "If you upload resume files, the files are stored in private object storage and linked to your account inside the application database.",
    ],
  },
  {
    title: "Authentication and account access",
    body: [
      "Authentication is handled through Clerk. DevApply stores the minimum account linkage needed to associate your authenticated identity with your workspace.",
      "Authenticated application, reminder, resume, and billing data is scoped to your account on the server.",
    ],
  },
  {
    title: "Payments and billing",
    body: [
      "Billing is handled through Polar hosted checkout and customer billing flows. DevApply stores normalized plan state plus the provider identifiers needed to keep billing access in sync.",
      "Payment card details are not stored directly in the DevApply application database.",
    ],
  },
  {
    title: "Analytics and operational data",
    body: [
      "DevApply uses PostHog for product analytics and event tracking related to signup, application activity, reminders, and billing milestones.",
      "Operational logs and infrastructure providers may process request metadata needed to run, secure, and debug the product.",
    ],
  },
  {
    title: "Emails and notifications",
    body: [
      "If transactional email is enabled, DevApply may use Resend to deliver product emails related to account access, reminders, or billing communication.",
    ],
  },
  {
    title: "Data sharing",
    body: [
      "DevApply uses third-party infrastructure and service providers only where needed to operate the product, including hosting, authentication, analytics, billing, email delivery, and file storage.",
      "DevApply does not sell your application-tracking data.",
    ],
  },
  {
    title: "Contact",
    body: [
      `Privacy questions or requests can be sent to ${SUPPORT_EMAIL}.`,
    ],
  },
] as const;

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="rounded-[2rem] border border-black/10 bg-white/90 p-8 shadow-sm">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            Privacy policy
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-950">
            How DevApply handles product data
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-stone-600">
            This policy describes the data DevApply processes to operate the job
            application tracker MVP. It is intended to match the current
            repository and shipped product scope.
          </p>
          <p className="text-sm text-stone-500">
            Effective date: March 30, 2026
          </p>
        </div>
      </section>

      <section className="space-y-4">
        {sections.map((section) => (
          <article
            key={section.title}
            className="rounded-[1.75rem] border border-black/10 bg-white/90 p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold tracking-tight text-stone-950">
              {section.title}
            </h2>
            <div className="mt-3 space-y-3">
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-stone-600">
                  {section.title === "Contact" ? (
                    <>
                      Privacy questions or requests can be sent to{" "}
                      <a
                        href={SUPPORT_MAILTO}
                        className="font-medium text-primary underline underline-offset-4"
                      >
                        {SUPPORT_EMAIL}
                      </a>
                      .
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
