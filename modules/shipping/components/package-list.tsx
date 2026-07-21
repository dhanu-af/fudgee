"use client";

import { DeleteRowButton } from "@/components/data-table/delete-row-button";
import { deletePackage } from "@/modules/shipping/actions";

type PackageRow = {
  id: string;
  boxType: string | null;
  weight: unknown;
  items: { quantity: unknown; product: { name: string; sku: string } }[];
};

export function PackageList({ packages, canDelete }: { packages: PackageRow[]; canDelete: boolean }) {
  if (packages.length === 0) {
    return <p className="text-sm text-muted-foreground">No boxes packed yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {packages.map((pkg, i) => (
        <div key={pkg.id} className="flex items-start justify-between gap-4 rounded-lg border p-3 text-sm">
          <div>
            <div className="font-medium">
              Box {i + 1}
              {pkg.boxType ? ` — ${pkg.boxType}` : ""}
              {pkg.weight ? ` (${String(pkg.weight)} kg)` : ""}
            </div>
            <ul className="mt-1 text-muted-foreground">
              {pkg.items.map((item, j) => (
                <li key={j}>
                  {String(item.quantity)} × {item.product.name} ({item.product.sku})
                </li>
              ))}
            </ul>
          </div>
          {canDelete && (
            <DeleteRowButton action={deletePackage.bind(null, pkg.id)} confirmMessage="Remove this box?" />
          )}
        </div>
      ))}
    </div>
  );
}
