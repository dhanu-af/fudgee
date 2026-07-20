-- Grants Admin (and Super Admin) the ability to delete Storefront/CMS
-- content (categories, gallery, reviews, FAQ, contact messages, newsletter
-- signups) without touching SYSTEM_DELETE's super-admin-only rule anywhere
-- else in the app. Deleting a Product itself still requires SYSTEM_DELETE.
INSERT INTO "Permission" (id, key, module, action) VALUES ('perm_storefront_delete', 'storefront:delete', 'storefront', 'delete') ON CONFLICT (key) DO NOTHING;
INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_super_admin', 'perm_storefront_delete') ON CONFLICT DO NOTHING;
INSERT INTO "RolePermission" ("roleId", "permissionId") VALUES ('role_admin', 'perm_storefront_delete') ON CONFLICT DO NOTHING;
