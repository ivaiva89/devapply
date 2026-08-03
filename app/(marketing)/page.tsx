import Link from "next/link";

const features = [
  {
    tag: "Pipeline",
    title: "Move stages without reaching for the mouse.",
    description:
      "Press 1–5 to jump a selected card. Drag if you prefer. Both paths, zero config.",
  },
  {
    tag: "Resumes",
    title: "Version every résumé like a branch.",
    description:
      "Link a specific cut to a specific application. Know which one got the reply.",
  },
  {
    tag: "Reminders",
    title: "Follow-ups that actually happen.",
    description:
      "Daily digest and stale-app nudges. Stop letting the good ones go cold.",
  },
];

export default function MarketingPage() {
  return (
    <div className="py-16 sm:py-20">
      {/* Hero */}
      <section className="max-w-3xl">
        <span className="mb-5 inline-flex items-center gap-2 rounded-chip border border-border bg-surface px-3 py-1 font-mono text-xs text-text-2">
          <span
            className="size-1.5 rounded-full bg-success"
            style={{
              boxShadow:
                "0 0 0 3px color-mix(in srgb, var(--success) 30%, transparent)",
            }}
            aria-hidden
          />
          Free during beta · no card required
        </span>

        <h1 className="text-5xl font-bold tracking-tight text-text sm:text-6xl">
          The job tracker
          <br />
          that keeps up with{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--primary), var(--accent))",
            }}
          >
            your terminal.
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-md text-text-2">
          A keyboard-first pipeline for developers running a real search. Move 20
          applications in 30 seconds. No spreadsheets, no cruft.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href="/sign-up"
            className="inline-flex h-10 items-center rounded-button bg-text px-5 text-sm font-medium text-canvas transition-colors duration-150 hover:bg-text-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Start tracking — free
          </Link>
          <Link
            href="/#features"
            className="inline-flex h-10 items-center gap-1.5 rounded-button px-4 text-sm font-medium text-text-2 transition-colors duration-150 hover:bg-surface-1 hover:text-text"
          >
            See how it works
            <span aria-hidden className="font-mono text-xs opacity-60">
              →
            </span>
          </Link>
          <span className="ml-1 font-mono text-xs text-text-3">
            ⌘ + K opens search · try it anywhere
          </span>
        </div>
      </section>

      {/* Feature grid — hairline-separated by a shared border */}
      <section
        id="features"
        className="mt-16 grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-3"
      >
        {features.map((feature) => (
          <div key={feature.tag} className="bg-surface p-6">
            <div className="font-mono text-xs uppercase tracking-wide text-primary">
              {feature.tag}
            </div>
            <h3 className="mt-2.5 mb-2 text-lg font-semibold text-text">
              {feature.title}
            </h3>
            <p className="text-sm text-text-2">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
