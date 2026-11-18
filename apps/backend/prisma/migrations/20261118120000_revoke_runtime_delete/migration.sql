-- Revoke all runtime DELETE privileges on operational tables from fillcart_app_user
-- In accordance with least-privilege security baseline, runtime application roles
-- must have ZERO DELETE privileges across all tables. Replay pruning and session cleanup
-- are strictly handled by separately privileged maintenance mechanisms.

REVOKE DELETE ON "User" FROM fillcart_app_user;
REVOKE DELETE ON "Credential" FROM fillcart_app_user;
REVOKE DELETE ON "Role" FROM fillcart_app_user;
REVOKE DELETE ON "Permission" FROM fillcart_app_user;
REVOKE DELETE ON "RolePermission" FROM fillcart_app_user;
REVOKE DELETE ON "PermissionProfile" FROM fillcart_app_user;
REVOKE DELETE ON "ProfilePermission" FROM fillcart_app_user;
REVOKE DELETE ON "AdminProfileAssignment" FROM fillcart_app_user;
REVOKE DELETE ON "StaffDirectPermission" FROM fillcart_app_user;
REVOKE DELETE ON "AdminInvitation" FROM fillcart_app_user;
REVOKE DELETE ON "SessionFamily" FROM fillcart_app_user;
REVOKE DELETE ON "RefreshToken" FROM fillcart_app_user;
REVOKE DELETE ON "ServiceClient" FROM fillcart_app_user;
REVOKE DELETE ON "ServicePublicKey" FROM fillcart_app_user;
REVOKE DELETE ON "ServiceTokenReplay" FROM fillcart_app_user;
REVOKE DELETE ON "AdminBootstrapMarker" FROM fillcart_app_user;
