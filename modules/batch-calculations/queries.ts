import { db } from "@/lib/db";

export function getBatchCalculations(recipeId: string) {
  return db.batchCalculation.findMany({
    where: { recipeId },
    orderBy: { createdAt: "desc" },
    include: { lines: { include: { product: true } } },
  });
}

export function getBatchCalculationById(id: string) {
  return db.batchCalculation.findUnique({
    where: { id },
    include: {
      recipe: { include: { product: true } },
      lines: { include: { product: true } },
    },
  });
}
