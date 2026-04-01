type UpgradePromptProps = {
  description: string;
  title: string;
};

export function UpgradePrompt({ description, title }: UpgradePromptProps) {
  return (
    <section className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
        Upgrade available
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/80">
        {description}
      </p>
    </section>
  );
}
