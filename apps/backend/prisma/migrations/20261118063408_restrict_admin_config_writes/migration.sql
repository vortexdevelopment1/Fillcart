-- Restrict administrative permission profile configuration writes from runtime role
REVOKE INSERT, UPDATE
ON TABLE "PermissionProfile", "ProfilePermission"
FROM fillcart_app_user;

-- Restrict AdminBootstrapMarker creation from runtime role (reserved for bootstrap CLI)
REVOKE INSERT
ON TABLE "AdminBootstrapMarker"
FROM fillcart_app_user;
