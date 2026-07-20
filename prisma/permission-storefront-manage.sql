-- Grants the new storefront:manage permission (added for the public
-- homepage/CMS feature) to Admin and Super Admin, matching how every other
-- permission in prisma/seed-data.sql is seeded. Permissions are data rows,
-- not part of a schema migration, so this is pasted into Neon directly
-- rather than shipped as a numbered migration-bookkeeping file.
INSERT INTO "Permission" (id, key, module, action) VALUES ('perm_storefront_manage', 'storefront:manage', 'storefront', 'manage') ON CONFLICT (key) DO NOTHING;
INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_super_admin', 'perm_storefront_manage') ON CONFLICT DO NOTHING;
INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_admin', 'perm_storefront_manage') ON CONFLICT DO NOTHING;
