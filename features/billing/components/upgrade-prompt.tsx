type UpgradePromptProps = {
  description: string;
  title: string;
};

export function UpgradePrompt({ description, title }: UpgradePromptProps) {
  return (
    <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
        Upgrade available
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-700">
        {description}
      </p>
    </section>
  );
}
