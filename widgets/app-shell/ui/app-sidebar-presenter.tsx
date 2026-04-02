"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { appNavigation } from "@/widgets/app-shell/model/navigation-items";

type AppSidebarPresenterProps = {
  currentPath?: string;
};

function isItemActive(currentPath: string, href: string) {
  if (href === "/dashboard") {
    return currentPath === href;
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function AppSidebarPresenter({ currentPath }: AppSidebarPresenterProps) {
  const pathname = usePathname();
  const activePath = pathname ?? currentPath ?? "/dashboard";

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="border-b border-border/70 p-4">
        <Link
          href="/dashboard"
          className="flex min-h-12 items-center gap-3 rounded-2xl border border-border/70 bg-card px-3 py-3 transition-colors hover:bg-accent/40"
        >
          <Image
            src="/devapply-logo-optimized.svg"
            alt="DevApply"
            width={150}
            height={150}
            className="h-9 w-auto shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">DevApply</p>
            <p className="text-xs leading-5 text-muted-foreground">
              Developer job search workspace
            </p>
          </div>
        </Link>
      </div>

      <div className="flex-1 space-y-2 p-4">
        {appNavigation.map((item) => {
          const isActive = isItemActive(activePath, item.href);
          const Icon = item.icon;

          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className="h-11 w-full justify-start rounded-xl"
            >
              <Link href={item.href} aria-current={isActive ? "page" : undefined}>
                <Icon />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </div>

      <div className="border-t border-border/70 p-4">
        <Card className="border-border/70 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">Stay organized</CardTitle>
              <Badge variant="outline" className="rounded-full">
                MVP
              </Badge>
            </div>
            <CardDescription>
              Keep applications, reminders, and resumes aligned from one
              workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full rounded-xl">
              <Link href="/settings">
                Open settings
                <ArrowUpRight />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
