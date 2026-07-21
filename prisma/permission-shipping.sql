-- Grants the new Shipping module's permissions. shipping:read is visible to
-- everyone who already sees Sales/Production/Warehouse context; shipping:write
-- (create shipments, pick/pack/dispatch, carriers, returns) is reserved for
-- Super Admin, Admin, and Warehouse staff (matching who actually runs
-- outbound shipping day to day).
INSERT INTO "Permission" (id, key, module, action) VALUES ('perm_shipping_read', 'shipping:read', 'shipping', 'read') ON CONFLICT (key) DO NOTHING;
INSERT INTO "Permission" (id, key, module, action) VALUES ('perm_shipping_write', 'shipping:write', 'shipping', 'write') ON CONFLICT (key) DO NOTHING;

INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_super_admin', 'perm_shipping_read') ON CONFLICT DO NOTHING;
INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_super_admin', 'perm_shipping_write') ON CONFLICT DO NOTHING;
INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_admin', 'perm_shipping_read') ON CONFLICT DO NOTHING;
INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_admin', 'perm_shipping_write') ON CONFLICT DO NOTHING;
INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_warehouse', 'perm_shipping_read') ON CONFLICT DO NOTHING;
INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_warehouse', 'perm_shipping_write') ON CONFLICT DO NOTHING;
INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_sales', 'perm_shipping_read') ON CONFLICT DO NOTHING;
INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_production', 'perm_shipping_read') ON CONFLICT DO NOTHING;
INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_finance', 'perm_shipping_read') ON CONFLICT DO NOTHING;
INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_management', 'perm_shipping_read') ON CONFLICT DO NOTHING;
