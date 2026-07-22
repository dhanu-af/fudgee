-- Grants the new Finance module's permissions. finance:read is visible to
-- Super Admin, Admin, the Finance role, and Management (all already see
-- Sales/Purchase Order context); finance:write (record expenses, assets,
-- invoices, and payments) is reserved for Super Admin, Admin, and Finance.
INSERT INTO "Permission" (id, key, module, action) VALUES ('perm_finance_read', 'finance:read', 'finance', 'read') ON CONFLICT (key) DO NOTHING;
INSERT INTO "Permission" (id, key, module, action) VALUES ('perm_finance_write', 'finance:write', 'finance', 'write') ON CONFLICT (key) DO NOTHING;

INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_super_admin', 'perm_finance_read') ON CONFLICT DO NOTHING;
INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_super_admin', 'perm_finance_write') ON CONFLICT DO NOTHING;
INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_admin', 'perm_finance_read') ON CONFLICT DO NOTHING;
INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_admin', 'perm_finance_write') ON CONFLICT DO NOTHING;
INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_finance', 'perm_finance_read') ON CONFLICT DO NOTHING;
INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_finance', 'perm_finance_write') ON CONFLICT DO NOTHING;
INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_management', 'perm_finance_read') ON CONFLICT DO NOTHING;
