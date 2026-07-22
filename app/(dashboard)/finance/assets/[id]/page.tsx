import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { can } from "@/lib/rbac/can";
import { getAssetWithScheduleById } from "@/modules/finance/queries";
import { depreciationSchedule } from "@/modules/finance/lib/depreciation";
import { updateAsset, deleteAsset } from "@/modules/finance/actions";
import { AssetForm } from "@/modules/finance/components/asset-form";
import { DepreciationScheduleTable } from "@/modules/finance/components/depreciation-schedule-table";
import { DeleteRowButton } from "@/components/data-table/delete-row-button";
import { Badge } from "@/components/ui/badge";

export default async function EditAssetPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission(PERMISSIONS.FINANCE_WRITE);
  const { id } = await params;
  const asset = await getAssetWithScheduleById(id);
  if (!asset) notFound();

  const schedule = depreciationSchedule(
    {
      purchaseDate: asset.purchaseDate,
      purchaseCost: Number(asset.purchaseCost),
      salvageValue: Number(asset.salvageValue),
      depreciationPeriodMonths: asset.depreciationPeriodMonths,
    },
    new Date()
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{`AST-${String(asset.seq).padStart(4, "0")} — ${asset.name}`}</h1>
          <p className="text-sm text-muted-foreground">
            Book value: {asset.bookValue.toFixed(2)}
            {asset.isFullyDepreciated && (
              <Badge variant="secondary" className="ml-2">
                Fully depreciated
              </Badge>
            )}
          </p>
        </div>
        {can(session, PERMISSIONS.SYSTEM_DELETE) && (
          <DeleteRowButton
            action={deleteAsset.bind(null, id)}
            confirmMessage={`Delete AST-${String(asset.seq).padStart(4, "0")}? This cannot be undone.`}
          />
        )}
      </div>

      <AssetForm action={updateAsset.bind(null, id)} asset={asset} />

      <div>
        <h2 className="mb-2 font-medium">Depreciation schedule</h2>
        <DepreciationScheduleTable rows={schedule} />
      </div>
    </div>
  );
}
