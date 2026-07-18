"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import {
  productionBatchSchema,
  productionBatchInputSchema,
  completeBatchSchema,
} from "@/modules/production/schema";

export type ProductionBatchFormState = { error?: string };

export async function createProductionBatch(
  _prev: ProductionBatchFormState,
  formData: FormData
): Promise<ProductionBatchFormState> {
  await requirePermission(PERMISSIONS.PRODUCTION_WRITE);

  const parsed = productionBatchSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  let rawInputs: unknown;
  try {
    rawInputs = JSON.parse(parsed.data.inputsJson);
  } catch {
    return { error: "Invalid raw material inputs." };
  }
  const inputsParsed = z
    .array(productionBatchInputSchema)
    .min(1, "At least one raw material input is required")
    .safeParse(rawInputs);
  if (!inputsParsed.success) {
    return { error: inputsParsed.error.issues[0]?.message ?? "Invalid raw material inputs." };
  }

  await db.productionBatch.create({
    data: {
      productId: parsed.data.productId,
      quantityPlanned: parsed.data.quantityPlanned,
      notes: parsed.data.notes || undefined,
      inputs: { create: inputsParsed.data },
    },
  });

  revalidatePath("/production");
  redirect("/production");
}

export type ProductionBatchActionState = { error?: string };

export async function startProductionBatch(
  id: string,
  _prev: ProductionBatchActionState,
  _formData: FormData
): Promise<ProductionBatchActionState> {
  await requirePermission(PERMISSIONS.PRODUCTION_WRITE);
  await db.productionBatch.update({ where: { id }, data: { status: "IN_PROGRESS", startedAt: new Date() } });
  revalidatePath(`/production/${id}`);
  return {};
}

export async function completeProductionBatch(
  id: string,
  _prev: ProductionBatchActionState,
  formData: FormData
): Promise<ProductionBatchActionState> {
  const session = await requirePermission(PERMISSIONS.PRODUCTION_WRITE);

  const parsed = completeBatchSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const batch = await db.productionBatch.findUnique({ where: { id }, include: { inputs: true } });
  if (!batch) return { error: "Production batch not found." };

  const location = await db.location.findFirst({ where: { isActive: true } });
  if (!location) {
    return { error: "Create a warehouse location before completing production batches." };
  }

  await db.$transaction([
    db.productionBatch.update({
      where: { id },
      data: {
        status: "COMPLETED",
        quantityActual: parsed.data.quantityActual,
        quantityWaste: parsed.data.quantityWaste,
        completedAt: new Date(),
      },
    }),
    ...batch.inputs.map((input) =>
      db.inventoryTransaction.create({
        data: {
          productId: input.productId,
          locationId: location.id,
          type: "ISSUE",
          quantity: -Number(input.quantity),
          referenceType: "ProductionBatch",
          referenceId: id,
          createdByUserId: session.user.id,
        },
      })
    ),
    db.inventoryTransaction.create({
      data: {
        productId: batch.productId,
        locationId: location.id,
        type: "RECEIPT",
        quantity: parsed.data.quantityActual,
        referenceType: "ProductionBatch",
        referenceId: id,
        createdByUserId: session.user.id,
      },
    }),
  ]);

  revalidatePath(`/production/${id}`);
  revalidatePath("/inventory");
  return {};
}

export async function cancelProductionBatch(
  id: string,
  _prev: ProductionBatchActionState,
  _formData: FormData
): Promise<ProductionBatchActionState> {
  await requirePermission(PERMISSIONS.PRODUCTION_WRITE);
  await db.productionBatch.update({ where: { id }, data: { status: "CANCELLED" } });
  revalidatePath(`/production/${id}`);
  return {};
}
