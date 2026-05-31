import { AppClsService } from "@/infrastructure/cls/cls.service";
import { ForbiddenException, Injectable } from "@nestjs/common";
import type { Permission } from "./permissions.constants";
import { POLICIES } from "./permissions.policies";
import type { PermissionSubject } from "./permissions.types";

/**
 * The decision point (PDP). Builds the subject from the workspace context cached
 * in CLS, then evaluates the policy registered for the requested permission.
 */
@Injectable()
export class PermissionService {
	constructor(private readonly cls: AppClsService) {}

	private getSubject(): PermissionSubject {
		const member = this.cls.workspaceContext?.member ?? null;
		return {
			userId: member?.userId ?? null,
			workspaceRole: member?.role ?? null,
		};
	}

	/** Returns whether the current caller may perform `permission` on `resource`. */
	public can<TResource>(permission: Permission, resource?: TResource): boolean {
		return POLICIES[permission](this.getSubject(), resource);
	}

	/** Throws {@link ForbiddenException} when the caller lacks `permission`. */
	public assert<TResource>(permission: Permission, resource?: TResource): void {
		if (!this.can(permission, resource)) {
			throw new ForbiddenException(`Missing permission: ${permission}`);
		}
	}
}