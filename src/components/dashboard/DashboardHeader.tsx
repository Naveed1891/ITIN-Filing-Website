import { DashboardLogout } from "./DashboardLogout";

export function DashboardHeader({ name }: { name: string }) {
  return (
    <header className="flex items-center justify-end gap-4 border-b border-border bg-white px-5 py-4 sm:px-8">
      <span className="text-sm font-semibold text-text-mid">{name}</span>
      <DashboardLogout />
    </header>
  );
}
