"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/rbac/guards";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { recipeSchema, recipeLineSchema } from "@/modules/recipes/schema";

export type RecipeFormState = { error?: string };

function parseLines(linesJson: string) {
  let rawLines: unknown;
  try {
    rawLines = JSON.parse(linesJson);
  } catch {
    return { error: "Invalid ingredients." } as const;
  }
  const parsed = z.array(recipeLineSchema).min(1, "At least one ingredient is required").safeParse(rawLines);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid ingredients." } as const;
  }

  const total = parsed.data.reduce((sum, l) => sum + l.percentage, 0);
  if (Math.abs(total - 100) > 0.01) {
    return { error: `Ingredient percentages must total 100% (currently ${total.toFixed(4)}%).` } as const;
  }

  return { lines: parsed.data } as const;
}

export async function createRecipe(_prev: RecipeFormState, formData: FormData): Promise<RecipeFormState> {
  await requirePermission(PERMISSIONS.PRODUCTION_WRITE);

  const parsed = recipeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const linesResult = parseLines(parsed.data.linesJson);
  if ("error" in linesResult) return { error: linesResult.error };

  try {
    await db.recipe.create({
      data: {
        productId: parsed.data.productId,
        name: parsed.data.name || undefined,
        baseBatchSize: parsed.data.baseBatchSize,
        notes: parsed.data.notes || undefined,
        lines: { create: linesResult.lines },
      },
    });
  } catch {
    return { error: "This product already has a recipe." };
  }

  revalidatePath("/production/recipes");
  redirect("/production/recipes");
}

export async function updateRecipe(
  id: string,
  _prev: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  await requirePermission(PERMISSIONS.PRODUCTION_WRITE);

  const parsed = recipeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const linesResult = parseLines(parsed.data.linesJson);
  if ("error" in linesResult) return { error: linesResult.error };

  await db.$transaction([
    db.recipe.update({
      where: { id },
      data: {
        name: parsed.data.name || undefined,
        baseBatchSize: parsed.data.baseBatchSize,
        notes: parsed.data.notes || undefined,
      },
    }),
    db.recipeLine.deleteMany({ where: { recipeId: id } }),
    db.recipeLine.createMany({ data: linesResult.lines.map((l) => ({ ...l, recipeId: id })) }),
  ]);

  revalidatePath("/production/recipes");
  revalidatePath(`/production/recipes/${id}`);
  redirect("/production/recipes");
}

export async function deleteRecipe(
  id: string,
  _prev: RecipeFormState,
  _formData: FormData
): Promise<RecipeFormState> {
  await requirePermission(PERMISSIONS.SYSTEM_DELETE);

  try {
    await db.recipe.delete({ where: { id } });
  } catch {
    return { error: "Failed to delete recipe." };
  }

  revalidatePath("/production/recipes");
  redirect("/production/recipes");
}
