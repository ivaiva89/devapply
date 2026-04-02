import { AppSidebarPresenter } from "@/widgets/app-shell/ui/app-sidebar-presenter";

type AppSidebarProps = {
  currentPath: string;
};

export function AppSidebar({ currentPath }: AppSidebarProps) {
  return <AppSidebarPresenter currentPath={currentPath} />;
}
