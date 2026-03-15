import { UserButton } from "@clerk/nextjs";

type AppHeaderProps = {
  title: string;
  description: string;
  userName: string;
  userEmail: string;
  planLabel: string;
};

export function AppHeader({
  title,
  description,
  userName,
  userEmail,
  planLabel,
}: AppHeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-black/10 bg-white p-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
          Authenticated workspace
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          {title}
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-stone-600">
          {description}
        </p>
      </div>
      <div className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-stone-950">{userName}</p>
          <p className="truncate text-sm text-stone-600">{userEmail}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            {planLabel} plan
          </p>
        </div>
        <UserButton />
      </div>
    </header>
  );
}
