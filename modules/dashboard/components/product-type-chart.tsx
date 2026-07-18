"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const SERIES_COLOR = "#1baf7a";

export function ProductTypeChart({ data }: { data: { type: string; count: number }[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
        No products yet — add some to see this chart.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={224}>
      <BarChart data={data} margin={{ top: 16, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="currentColor" className="text-border" strokeDasharray="0" />
        <XAxis
          dataKey="type"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "currentColor", fontSize: 12 }}
          className="text-muted-foreground"
        />
        <YAxis hide allowDecimals={false} />
        <Tooltip
          cursor={{ fill: "currentColor", className: "text-muted opacity-40" } as never}
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            color: "var(--popover-foreground)",
            fontSize: 12,
          }}
        />
        <Bar dataKey="count" name="Products" fill={SERIES_COLOR} radius={[4, 4, 0, 0]} maxBarSize={48}>
          <LabelList dataKey="count" position="top" className="fill-foreground" fontSize={12} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
