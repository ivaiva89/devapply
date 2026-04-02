import type { ReactNode } from "react";

import { Card, CardContent } from "@/shared/ui/card";

export type ApplicationCardData = {
  id: string;
  company: string;
  role: string;
  appliedDate: string;
  sourceLabel: string;
  updatedAt: string;
};

type ApplicationCardProps = {
  footer?: ReactNode;
  item: ApplicationCardData;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
};

export function ApplicationCard({
  footer,
  item,
  draggable,
  onDragStart,
  onDragEnd,
}: ApplicationCardProps) {
  return (
    <Card
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="group cursor-grab rounded-2xl border-none bg-muted/30 shadow-sm transition-all hover:bg-muted/60 active:cursor-grabbing"
    >
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {item.company}
          </p>
          <p className="text-sm text-muted-foreground">{item.role}</p>
        </div>
        <dl className="space-y-1 font-label text-xs text-muted-foreground">
          <div className="flex justify-between gap-3">
            <dt>Applied</dt>
            <dd>{item.appliedDate}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Source</dt>
            <dd>{item.sourceLabel}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>Updated</dt>
            <dd>{item.updatedAt}</dd>
          </div>
        </dl>
        {footer ? <div>{footer}</div> : null}
      </CardContent>
    </Card>
  );
}
