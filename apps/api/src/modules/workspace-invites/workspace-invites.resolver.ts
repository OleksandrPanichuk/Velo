import { WorkspaceInviteModel } from "@/models/WorkspaceInvite.model";
import { WorkspaceModel } from "@/models/Workspace.model";
import { Permission, PermissionService, RequirePermission } from "@/modules/permissions";
import { CurrentUser } from "@/shared/decorators";
import { Args, Resolver } from "@nestjs/graphql";
import { UUIDResolver } from "graphql-scalars";
import {
	AcceptInviteMutation,
	GetPendingInvitesQuery,
	InviteMemberMutation,
	RevokeInviteMutation,
} from "./workspace-invites.decorators";
import { InviteMemberInput } from "./workspace-invites.dto";
import { WorkspaceInvitesService } from "./workspace-invites.service";

@Resolver()
export class WorkspaceInvitesResolver {
	constructor(
		private readonly workspaceInvitesService: WorkspaceInvitesService,
		private readonly permissions: PermissionService,
	) {}

	@GetPendingInvitesQuery()
	@RequirePermission(Permission.MemberInvite)
	public async pendingInvites(
		@Args("workspaceId", { type: () => UUIDResolver }) workspaceId: string,
	): Promise<WorkspaceInviteModel[]> {
		this.permissions.assertWorkspace(workspaceId);

		return this.workspaceInvitesService.findPending(workspaceId);
	}

	@InviteMemberMutation()
	@RequirePermission(Permission.MemberInvite)
	public async inviteMember(
		@CurrentUser("id") userId: string,
		@Args("input") input: InviteMemberInput,
	): Promise<WorkspaceInviteModel> {
		this.permissions.assertWorkspace(input.workspaceId);

		return this.workspaceInvitesService.invite(input, userId);
	}

	@RevokeInviteMutation()
	@RequirePermission(Permission.MemberInvite)
	public async revokeInvite(
		@Args("id", { type: () => UUIDResolver }) id: string,
	): Promise<boolean> {
		// Scoped to the active workspace rather than taking a workspaceId argument,
		// so a bare invite id cannot be revoked across tenants.
		return this.workspaceInvitesService.revoke(id, this.permissions.getActiveWorkspaceId());
	}

	@AcceptInviteMutation()
	public async acceptInvite(
		@CurrentUser("id") userId: string,
		@Args("token") token: string,
	): Promise<WorkspaceModel> {
		return this.workspaceInvitesService.accept(token, userId);
	}
}
