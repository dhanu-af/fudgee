import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Truck,
  Warehouse,
  Factory,
  FlaskConical,
  BarChart3,
  UserCog,
  Settings,
  Store,
} from "lucide-react";
import { PERMISSIONS, type PermissionKey } from "@/lib/rbac/permissions";

export interface ModuleDefinition {
  key: string;
  label: string;
  route: string;
  icon: LucideIcon;
  permission: PermissionKey;
  group: "core" | "operations" | "insights" | "admin";
}

// Single source of truth for sidebar nav + route gating. Adding a Phase 2
// module means adding one entry here (+ a route/module folder) — nothing
// else needs to change.
export const MODULE_REGISTRY: ModuleDefinition[] = [
  { key: "dashboard", label: "Dashboard", route: "/dashboard", icon: LayoutDashboard, permission: PERMISSIONS.DASHBOARD_VIEW, group: "core" },
  { key: "products", label: "Products", route: "/products", icon: Package, permission: PERMISSIONS.PRODUCTS_READ, group: "core" },
  { key: "customers", label: "Customers", route: "/customers", icon: Users, permission: PERMISSIONS.CUSTOMERS_READ, group: "core" },
  { key: "sales_orders", label: "Sales Orders", route: "/sales-orders", icon: ShoppingCart, permission: PERMISSIONS.SALES_ORDERS_READ, group: "operations" },
  { key: "purchase_orders", label: "Purchase Orders", route: "/purchase-orders", icon: Truck, permission: PERMISSIONS.PURCHASE_ORDERS_READ, group: "operations" },
  { key: "inventory", label: "Inventory", route: "/inventory", icon: Package, permission: PERMISSIONS.INVENTORY_READ, group: "operations" },
  { key: "warehouse", label: "Warehouse", route: "/warehouse", icon: Warehouse, permission: PERMISSIONS.WAREHOUSE_READ, group: "operations" },
  { key: "production", label: "Production", route: "/production", icon: Factory, permission: PERMISSIONS.PRODUCTION_READ, group: "operations" },
  { key: "quality", label: "Quality Control", route: "/quality", icon: FlaskConical, permission: PERMISSIONS.QUALITY_READ, group: "operations" },
  { key: "reports", label: "Reports", route: "/reports", icon: BarChart3, permission: PERMISSIONS.REPORTS_READ, group: "insights" },
  { key: "users", label: "User Management", route: "/users", icon: UserCog, permission: PERMISSIONS.USERS_MANAGE, group: "admin" },
  { key: "storefront", label: "Storefront", route: "/storefront", icon: Store, permission: PERMISSIONS.STOREFRONT_MANAGE, group: "admin" },
  { key: "settings", label: "Settings", route: "/settings", icon: Settings, permission: PERMISSIONS.SETTINGS_MANAGE, group: "admin" },
];

export function modulesForPermissions(permissions: PermissionKey[]): ModuleDefinition[] {
  return MODULE_REGISTRY.filter((m) => permissions.includes(m.permission));
}
