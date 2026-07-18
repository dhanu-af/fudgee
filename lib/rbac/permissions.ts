export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard:view",
  PRODUCTS_READ: "products:read",
  PRODUCTS_WRITE: "products:write",
  CUSTOMERS_READ: "customers:read",
  CUSTOMERS_WRITE: "customers:write",
  SALES_ORDERS_READ: "sales_orders:read",
  SALES_ORDERS_WRITE: "sales_orders:write",
  PURCHASE_ORDERS_READ: "purchase_orders:read",
  PURCHASE_ORDERS_WRITE: "purchase_orders:write",
  INVENTORY_READ: "inventory:read",
  INVENTORY_WRITE: "inventory:write",
  WAREHOUSE_READ: "warehouse:read",
  WAREHOUSE_WRITE: "warehouse:write",
  PRODUCTION_READ: "production:read",
  PRODUCTION_WRITE: "production:write",
  QUALITY_READ: "quality:read",
  QUALITY_WRITE: "quality:write",
  REPORTS_READ: "reports:read",
  USERS_MANAGE: "users:manage",
  SETTINGS_MANAGE: "settings:manage",
  // Deliberately not granted to admin — delete is reserved for super_admin
  // only, across every module, per Dhanu's explicit request.
  SYSTEM_DELETE: "system:delete",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Central role -> permission matrix. Adding a role or a Phase 2 module's
// permissions means adding entries here (+ reseeding), not scattered edits.
export const ROLE_DEFAULT_PERMISSIONS: Record<string, PermissionKey[]> = {
  super_admin: Object.values(PERMISSIONS),
  admin: Object.values(PERMISSIONS).filter(
    (p) => p !== PERMISSIONS.SETTINGS_MANAGE && p !== PERMISSIONS.SYSTEM_DELETE
  ),
  production: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PRODUCTION_READ,
    PERMISSIONS.PRODUCTION_WRITE,
    PERMISSIONS.QUALITY_READ,
    PERMISSIONS.QUALITY_WRITE,
    PERMISSIONS.INVENTORY_READ,
  ],
  warehouse: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.WAREHOUSE_READ,
    PERMISSIONS.WAREHOUSE_WRITE,
    PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.INVENTORY_WRITE,
    PERMISSIONS.PURCHASE_ORDERS_READ,
  ],
  sales: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.CUSTOMERS_READ,
    PERMISSIONS.CUSTOMERS_WRITE,
    PERMISSIONS.SALES_ORDERS_READ,
    PERMISSIONS.SALES_ORDERS_WRITE,
    PERMISSIONS.PRODUCTS_READ,
  ],
  finance: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.SALES_ORDERS_READ,
    PERMISSIONS.PURCHASE_ORDERS_READ,
    PERMISSIONS.REPORTS_READ,
  ],
  management: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.CUSTOMERS_READ,
    PERMISSIONS.SALES_ORDERS_READ,
    PERMISSIONS.PURCHASE_ORDERS_READ,
    PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.PRODUCTION_READ,
    PERMISSIONS.QUALITY_READ,
  ],
};

export const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  production: "Production",
  warehouse: "Warehouse",
  sales: "Sales",
  finance: "Finance",
  management: "Management",
};
