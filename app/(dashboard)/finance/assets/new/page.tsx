import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { createAsset } from "@/modules/finance/actions";
import { AssetForm } from "@/modules/finance/components/asset-form";

export default async function NewAssetPage() {
  await requirePermission(PERMISSIONS.FINANCE_WRITE);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">New asset</h1>
      <AssetForm action={createAsset} />
    </div>
  );
}
