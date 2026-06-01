import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Permission } from "@/modules/permissions";
import { PermissionService, REQUIRE_PERMISSION_KEY } from "@/modules/permissions";

/**
 * The enforcement point (PEP) for declarative checks. Reads the permissions
 * required by `@RequirePermission` and asserts each against the cached workspace
 * role. Handlers without the decorator are allowed through untouched.
 */
@Injectable()
export class PoliciesGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly permissions: PermissionService,
	) {}

	public canActivate(context: ExecutionContext): boolean {
		const required = this.reflector.getAllAndOverride<Permission[] | undefined>(
			REQUIRE_PERMISSION_KEY,
			[context.getHandler(), context.getClass()],
		);

		if (!required?.length) return true;

		for (const permission of required) {
			this.permissions.assert(permission);
		}

		return true;
	}
}
