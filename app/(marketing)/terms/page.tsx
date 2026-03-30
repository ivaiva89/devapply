import type { Metadata } from "next";

import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/support";

export const metadata: Metadata = {
  title: "Terms of Service | DevApply",
  description:
    "Terms of service for DevApply, the developer job application tracker.",
};

const sections = [
  {
    title: "Using DevApply",
    body: [
      "DevApply is a software product for managing developer job applications, reminders, resume attachments, and related workflow data.",
      "You are responsible for the accuracy of the information you add to your workspace and for keeping your account credentials secure.",
    ],
  },
  {
    title: "Accounts and access",
    body: [
      "Access to authenticated product features requires a valid account. DevApply may suspend or restrict access if the product is used abusively, unlawfully, or in a way that threatens service reliability or other users.",
      "You may only access data and billing state associated with your own account.",
    ],
  },
  {
    title: "Billing and plan limits",
    body: [
      "DevApply offers free and paid product access. Paid billing flows are handled through Polar hosted checkout and related billing tools.",
      "Free and Pro plan behavior, including usage limits, may change as the product evolves, but server-enforced plan state controls access inside the app.",
    ],
  },
  {
    title: "Service availability",
    body: [
      "DevApply is provided on a best-effort basis during the MVP stage. Features, integrations, and limits may change as the product develops.",
      "The service may rely on third-party providers for hosting, authentication, analytics, billing, email delivery, and file storage.",
    ],
  },
  {
    title: "Acceptable use",
    body: [
      "You may not use DevApply to interfere with the product, attempt unauthorized access, violate applicable law, or abuse infrastructure or billing flows.",
    ],
  },
  {
    title: "Contact",
    body: [
      `Terms questions can be sent to ${SUPPORT_EMAIL}.`,
    ],
  },
] as const;

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="rounded-[2rem] border border-black/10 bg-white/90 p-8 shadow-sm">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            Terms of service
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-950">
            Terms for using DevApply
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-stone-600">
            These terms describe the current MVP usage expectations for DevApply
            and should be read together with the privacy policy.
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
                      Terms questions can be sent to{" "}
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
