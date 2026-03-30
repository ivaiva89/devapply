import { AppSidebarPresenter } from "@/features/navigation/components/app-sidebar-presenter";

type AppSidebarProps = {
  currentPath: string;
};

export function AppSidebar({ currentPath }: AppSidebarProps) {
  return <AppSidebarPresenter currentPath={currentPath} />;
}
