import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getContactMessages } from "@/modules/storefront/queries";
import { messageColumns } from "@/modules/storefront/components/message-columns";
import { DataTable } from "@/components/data-table/data-table";
import { TabNav } from "@/components/layout/tab-nav";
import { STOREFRONT_TABS } from "@/modules/storefront/nav";

export default async function StorefrontMessagesPage() {
  await requirePermission(PERMISSIONS.STOREFRONT_MANAGE);
  const messages = await getContactMessages();

  return (
    <div className="flex flex-col gap-4">
      <TabNav active="/storefront/messages" tabs={STOREFRONT_TABS} />
      <h1 className="text-xl font-semibold">Contact messages</h1>
      <DataTable columns={messageColumns} data={messages} emptyMessage="No messages yet." />
    </div>
  );
}
