"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Menu,
  Search,
  Settings2,
  LayoutDashboard,
  CreditCard,
} from "lucide-react";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { AppSidebarPresenter } from "@/widgets/app-shell/ui/app-sidebar-presenter";

type AppHeaderPresenterProps = {
  currentPath: string;
  description?: string;
  planLabel: string;
  title?: string;
  userControl?: ReactNode;
  userEmail: string;
  userName: string;
};

export function AppHeaderPresenter({
  currentPath,
  description,
  planLabel,
  title,
  userControl = null,
  userEmail,
  userName,
}: AppHeaderPresenterProps) {
  const router = useRouter();
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="lg:hidden"
              >
                <Menu />
                <span className="sr-only">Open navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[20rem] p-0">
              <SheetHeader className="border-b border-border/70 px-6 py-5">
                <SheetTitle>{title ?? "DevApply"}</SheetTitle>
                <SheetDescription>
                  {description ??
                    "Track applications, reminders, resumes, and billing from one workspace."}
                </SheetDescription>
              </SheetHeader>
              <AppSidebarPresenter currentPath={currentPath} />
            </SheetContent>
          </Sheet>
          <div className="min-w-0">
            {title ? (
              <p className="truncate text-sm font-semibold text-text sm:text-base">
                {title}
              </p>
            ) : null}
            {description ? (
              <p className="hidden truncate text-xs text-text-3 xl:block">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        <div className="relative ml-auto hidden w-full max-w-sm items-center md:flex">
          <Search className="pointer-events-none absolute left-3 size-4 text-text-3" />
          <Input
            type="search"
            aria-label="Search workspace"
            placeholder="Search applications, reminders, or resumes"
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="hidden rounded-full px-2.5 py-1 font-label text-[10px] uppercase tracking-[0.18em] text-text-3 sm:inline-flex"
          >
            {planLabel}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-full px-2.5"
                />
              }
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {initials}
              </span>
              <span className="hidden text-left sm:flex sm:flex-col">
                <span className="max-w-32 truncate text-sm font-medium">
                  {userName}
                </span>
              </span>
              <ChevronDown className="text-text-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-text">
                        {userName}
                      </span>
                      <Badge variant="outline" className="rounded-full">
                        {planLabel}
                      </Badge>
                    </div>
                    <p className="text-xs text-text-3">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                <LayoutDashboard />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings2 />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              {userControl ? (
                <>
                  <DropdownMenuSeparator />
                  <div className="px-1 pb-1">{userControl}</div>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
