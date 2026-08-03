import Link from "next/link";

const features = [
  {
    title: "Pipeline board",
    description: "Kanban view of every application. Move cards with drag or keyboard.",
  },
  {
    title: "Smart reminders",
    description: "Follow-up alerts that surface in your daily dashboard, not just in a list.",
  },
  {
    title: "Resume vault",
    description: "Store versions of your resume. Attach the right one to each application.",
  },
];

export default function MarketingPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      {/* Hero */}
      <div className="mb-16 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-text">
          Stop losing track of your job search
        </h1>
        <p className="mt-4 text-lg text-text-2">
          DevApply gives you a pipeline board, reminder system, and resume vault — built for developers who apply like engineers.
        </p>
        <Link
          href="/sign-up"
          className="mt-8 inline-flex h-10 items-center rounded-button bg-primary px-6 text-sm font-medium text-primary-on transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-primary"
        >
          Start tracking — it&apos;s free
        </Link>
      </div>

      {/* Feature cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-card border border-border bg-surface p-5"
          >
            <h3 className="text-sm font-semibold text-text">{feature.title}</h3>
            <p className="mt-1.5 text-sm text-text-2">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
