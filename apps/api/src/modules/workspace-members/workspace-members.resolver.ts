import { WorkspaceMemberModel } from "@/models/WorkspaceMember.model";
import { PermissionService, Permission, RequirePermission } from "@/modules/permissions";
import { Args, Resolver } from "@nestjs/graphql";
import { UUIDResolver } from "graphql-scalars";
import { GetWorkspaceMembersQuery } from "./workspace-members.decorators";
import { WorkspaceMembersService } from "./workspace-members.service";

@Resolver()
export class WorkspaceMembersResolver {
	constructor(
		private readonly workspaceMembersService: WorkspaceMembersService,
		private readonly permissions: PermissionService,
	) {}

	@GetWorkspaceMembersQuery()
	@RequirePermission(Permission.MemberRead)
	public async members(
		@Args("workspaceId", { type: () => UUIDResolver }) workspaceId: string,
	): Promise<WorkspaceMemberModel[]> {
		this.permissions.assertWorkspace(workspaceId);

		return this.workspaceMembersService.findByWorkspaceId(workspaceId);
	}
}
