import type { ReactNode } from "react";

import { AppShell } from "@/widgets/app-shell/ui/app-shell";

interface AppLayoutProps {
  children: ReactNode;
}

// Every page in the `(app)` group sits inside the app shell.
export default function AppLayout({ children }: AppLayoutProps): ReactNode {
  return <AppShell>{children}</AppShell>;
}
