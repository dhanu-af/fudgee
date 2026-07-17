import { UserMenu } from "@/components/layout/user-menu";

export function Topbar({ name, roleKey }: { name: string; roleKey: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-end border-b px-4">
      <UserMenu name={name} roleKey={roleKey} />
    </header>
  );
}
