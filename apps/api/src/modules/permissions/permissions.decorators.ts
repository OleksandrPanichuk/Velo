import { type CustomDecorator, SetMetadata } from "@nestjs/common";
import type { Permission } from "./permissions.constants";

export const REQUIRE_PERMISSION_KEY = "requirePermission";

/**
 * Require one or more permissions on a resolver/handler. Enforced by
 * {@link PoliciesGuard}. All listed permissions must be satisfied.
 */
export const RequirePermission = (...permissions: Permission[]): CustomDecorator =>
	SetMetadata(REQUIRE_PERMISSION_KEY, permissions);