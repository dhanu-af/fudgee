"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const PRODUCTS_COLOR = "#2a78d6";
const CUSTOMERS_COLOR = "#1baf7a";

type Point = { label: string; products: number; customers: number };

export function RecordsTrendChart({ data }: { data: Point[] }) {
  const hasData = data.some((d) => d.products > 0 || d.customers > 0);
  if (!hasData) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
        No activity in the last 14 days yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={224}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }} barGap={2}>
        <CartesianGrid vertical={false} stroke="currentColor" className="text-border" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          tick={{ fill: "currentColor", fontSize: 11 }}
          className="text-muted-foreground"
        />
        <YAxis hide allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            color: "var(--popover-foreground)",
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="products" name="Products" fill={PRODUCTS_COLOR} radius={[4, 4, 0, 0]} maxBarSize={16} />
        <Bar dataKey="customers" name="Customers" fill={CUSTOMERS_COLOR} radius={[4, 4, 0, 0]} maxBarSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}
