"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Line = {
  productId: string;
  productName: string;
  productSku: string;
  quantityPerUnit: number;
  costPrice: number;
};

export function BatchCalculator({
  recipeId,
  lines,
  sellPrice,
}: {
  recipeId: string;
  lines: Line[];
  sellPrice: number | null;
}) {
  const [targetQuantity, setTargetQuantity] = useState("500");
  const qty = Number(targetQuantity) || 0;

  const scaledLines = lines.map((line) => {
    const totalQuantity = line.quantityPerUnit * qty;
    const totalCost = totalQuantity * line.costPrice;
    return { ...line, totalQuantity, totalCost };
  });
  const totalCost = scaledLines.reduce((sum, l) => sum + l.totalCost, 0);
  const costPerUnit = qty > 0 ? totalCost / qty : 0;
  const profitPerUnit = sellPrice !== null ? sellPrice - costPerUnit : null;
  const totalProfit = profitPerUnit !== null ? profitPerUnit * qty : null;

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Batch Calculator</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="targetQuantity">How many units do you want to make?</Label>
          <Input
            id="targetQuantity"
            type="number"
            min="0"
            step="1"
            value={targetQuantity}
            onChange={(e) => setTargetQuantity(e.target.value)}
            className="w-40"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Raw material</TableHead>
              <TableHead>Qty per unit</TableHead>
              <TableHead>Total quantity needed</TableHead>
              <TableHead>Total cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scaledLines.map((line) => (
              <TableRow key={line.productId}>
                <TableCell>{`${line.productName} (${line.productSku})`}</TableCell>
                <TableCell>{line.quantityPerUnit}</TableCell>
                <TableCell>{line.totalQuantity.toFixed(2)}</TableCell>
                <TableCell>{line.totalCost.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total raw material cost</span>
            <span className="font-medium">{totalCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cost per unit</span>
            <span>{costPerUnit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sell price per unit</span>
            <span>{sellPrice !== null ? sellPrice.toFixed(2) : "not set"}</span>
          </div>
          <div className="flex justify-between border-t border-border/60 pt-1 font-medium">
            <span>Profit per unit</span>
            <span>{profitPerUnit !== null ? profitPerUnit.toFixed(2) : "—"}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total batch profit</span>
            <span>{totalProfit !== null ? totalProfit.toFixed(2) : "—"}</span>
          </div>
        </div>

        <Button
          render={
            <Link href={`/production/new?recipeId=${recipeId}&quantity=${qty}`} />
          }
          className="w-fit"
        >
          Create production batch with this quantity
        </Button>
      </CardContent>
    </Card>
  );
}
