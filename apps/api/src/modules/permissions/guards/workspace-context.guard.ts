import { AppClsService } from "@/infrastructure/cls/cls.service";
import { getGqlRequest } from "@/utils";
import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import { PermissionsRepository } from "../permissions.repository";

const WORKSPACE_HEADER = "x-workspace-id";

/**
 * Resolves the active workspace from the `x-workspace-id` header and caches the
 * caller's membership role in CLS for the rest of the request. Always allows the
 * request through — it is a context loader, not a gate. Authorization happens in
 * {@link PoliciesGuard} / PermissionService, which deny when the role is absent.
 */
@Injectable()
export class WorkspaceContextGuard implements CanActivate {
	constructor(
		private readonly permissionsRepository: PermissionsRepository,
		private readonly cls: AppClsService,
	) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = getGqlRequest(context);

		const header = req.headers[WORKSPACE_HEADER];
		const workspaceId = Array.isArray(header) ? header[0] : header;
		if (!workspaceId) return true;

		const userId = req.user?.userId;
		const role = userId
			? await this.permissionsRepository.getMemberRole(workspaceId, userId)
			: null;

		this.cls.setWorkspaceContext({
			workspaceId,
			member: userId && role ? { userId, role } : null,
		});

		return true;
	}
}
