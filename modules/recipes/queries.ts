import { db } from "@/lib/db";

export function getRecipes() {
  return db.recipe.findMany({ orderBy: { createdAt: "desc" }, include: { product: true } });
}

export function getRecipeById(id: string) {
  return db.recipe.findUnique({
    where: { id },
    include: { product: true, lines: { include: { product: true } } },
  });
}

export function getRecipeByProductId(productId: string) {
  return db.recipe.findUnique({
    where: { productId },
    include: { lines: { include: { product: true } } },
  });
}

// Only offer finished goods that don't already have a recipe (one recipe
// per product for MVP simplicity) when creating a new one.
export function getFinishedGoodOptionsWithoutRecipe() {
  return db.product.findMany({
    where: { status: "ACTIVE", type: "FINISHED_GOOD", recipe: null },
    select: { id: true, sku: true, name: true },
    orderBy: { name: "asc" },
  });
}

export function getRawMaterialOptions() {
  return db.product.findMany({
    where: { status: "ACTIVE", type: { in: ["RAW_MATERIAL", "PACKAGING"] } },
    select: { id: true, sku: true, name: true, costPrice: true },
    orderBy: { name: "asc" },
  });
}
