type UpgradePromptProps = {
  description: string;
  title: string;
};

export function UpgradePrompt({ description, title }: UpgradePromptProps) {
  return (
    <section className="rounded-3xl border border-warning/30 bg-warning-soft p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-warning">
        Upgrade available
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-text">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-text/80">
        {description}
      </p>
    </section>
  );
}
