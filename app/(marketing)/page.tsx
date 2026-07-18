import Link from "next/link";
import {
  Package,
  Users,
  ShoppingCart,
  Truck,
  Warehouse,
  Factory,
  FlaskConical,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Package,
    title: "Products & Customers",
    description: "Track finished goods, raw materials, and packaging alongside your customer records.",
  },
  {
    icon: ShoppingCart,
    title: "Sales Orders",
    description: "Build multi-line sales orders and fulfill them straight against your live stock.",
  },
  {
    icon: Truck,
    title: "Purchase Orders & Suppliers",
    description: "Raise purchase orders against your supplier list and receive stock in as it arrives.",
  },
  {
    icon: Warehouse,
    title: "Warehouse & Inventory",
    description: "Manage storage locations and see on-hand stock levels, backed by a full transaction ledger.",
  },
  {
    icon: Factory,
    title: "Production",
    description: "Plan production batches, track raw material inputs, and record finished-good output.",
  },
  {
    icon: FlaskConical,
    title: "Quality Control",
    description: "Record pass/fail checks against production batches to keep quality accountable.",
  },
  {
    icon: BarChart3,
    title: "Reports",
    description: "Order summaries, inventory valuation, production output, and QC pass rates in one place.",
  },
  {
    icon: Users,
    title: "Role-based access",
    description: "Every user signs in with a role — Sales, Warehouse, Production, Finance, and more — that controls exactly what they can see and do.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-lg font-semibold">Fudgee</span>
        <Button render={<Link href="/login" />}>Sign In</Button>
      </header>

      <div className="flex flex-1 flex-col items-center gap-16 px-6 py-16">
        <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-semibold tracking-tight">Fudgee</h1>
          <p className="text-lg text-muted-foreground">
            Manufacturing operations for food, pharmaceutical, and nutraceutical producers — orders,
            inventory, production, and quality control in one system.
          </p>
          <Button render={<Link href="/login" />} className="mt-2">
            Sign In
          </Button>
        </div>

        <div className="grid w-full max-w-5xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/60">
              <CardHeader className="flex-row items-center gap-2 space-y-0">
                <feature.icon className="size-4 text-primary" />
                <CardTitle className="text-sm font-medium">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
