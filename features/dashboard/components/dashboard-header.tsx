type DashboardHeaderProps = {
  title: string;
  description?: string;
};

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <div>
      <h1 className="text-base font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      {description ? (
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
