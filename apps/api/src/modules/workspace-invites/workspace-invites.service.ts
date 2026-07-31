import type { Env } from "@/config";
import { WorkspaceInviteModel } from "@/models/WorkspaceInvite.model";
import { WorkspaceModel } from "@/models/Workspace.model";
import { UsersService } from "@/modules/users/users.service";
import { MailQueue } from "@/queues/mail";
import { Transactional } from "@nestjs-cls/transactional";
import {
	ConflictException,
	ForbiddenException,
	GoneException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomBytes } from "node:crypto";
import { WorkspaceMembersService } from "../workspace-members/workspace-members.service";
import { WorkspacesService } from "../workspaces/workspaces.service";
import {
	WORKSPACE_INVITE_EXPIRES_IN,
	WORKSPACE_INVITE_ROLE_TO_MEMBER_ROLE,
	WORKSPACE_INVITE_TOKEN_BYTES,
	WORKSPACE_INVITE_TTL_MS,
} from "./workspace-invites.constants";
import { InviteMemberInput } from "./workspace-invites.dto";
import { WorkspaceInvitesRepository } from "./workspace-invites.repository";

@Injectable()
export class WorkspaceInvitesService {
	constructor(
		private readonly workspaceInvitesRepository: WorkspaceInvitesRepository,
		private readonly workspaceMembersService: WorkspaceMembersService,
		private readonly workspacesService: WorkspacesService,
		private readonly usersService: UsersService,
		private readonly mailQueue: MailQueue,
		private readonly config: ConfigService<Env>,
	) {}

	public async findPending(workspaceId: string): Promise<WorkspaceInviteModel[]> {
		return this.workspaceInvitesRepository.findPendingByWorkspaceId(workspaceId);
	}

	public async invite(dto: InviteMemberInput, inviterUserId: string): Promise<WorkspaceInviteModel> {
		const email = dto.email.toLowerCase();

		const workspace = await this.workspacesService.findById(dto.workspaceId);
		if (!workspace) {
			throw new NotFoundException("Workspace not found");
		}

		const inviter = await this.workspaceMembersService.findOneByWorkspaceAndUser(
			dto.workspaceId,
			inviterUserId,
		);
		if (!inviter) {
			throw new ForbiddenException("You are not a member of this workspace");
		}

		await this.assertNotAlreadyMember(dto.workspaceId, email);

		const token = this.generateToken();
		const expiresAt = new Date(Date.now() + WORKSPACE_INVITE_TTL_MS);

		const existing = await this.workspaceInvitesRepository.findPendingByWorkspaceAndEmail(
			dto.workspaceId,
			email,
		);

		const invite = existing
			? await this.workspaceInvitesRepository.update(existing.id, {
					role: dto.role,
					token,
					expiresAt,
					inviterId: inviter.id,
				})
			: await this.workspaceInvitesRepository.create({
					workspaceId: dto.workspaceId,
					email,
					role: dto.role,
					token,
					expiresAt,
					inviterId: inviter.id,
				});

		if (!invite) {
			throw new NotFoundException("Invite not found");
		}

		const inviterUser = inviter.user ?? (await this.usersService.findById(inviterUserId));

		await this.mailQueue.enqueueWorkspaceInvite(email, {
			inviteUrl: `${this.config.getOrThrow<string>("CLIENT_INVITE_URL")}?token=${token}`,
			workspaceName: workspace.name,
			inviterName: inviterUser?.fullName ?? inviterUser?.username ?? "A teammate",
			role: dto.role,
			expiresIn: WORKSPACE_INVITE_EXPIRES_IN,
		});

		return (await this.workspaceInvitesRepository.findByIdWithInviter(invite.id)) ?? invite;
	}

	public async revoke(id: string, workspaceId: string): Promise<boolean> {
		const invite = await this.workspaceInvitesRepository.findByIdAndWorkspaceId(id, workspaceId);

		if (!invite) {
			throw new NotFoundException("Invite not found");
		}

		if (invite.acceptedAt) {
			throw new ConflictException("This invite has already been accepted");
		}

		await this.workspaceInvitesRepository.deleteById(id);

		return true;
	}

	@Transactional()
	public async accept(token: string, userId: string): Promise<WorkspaceModel> {
		const invite = await this.workspaceInvitesRepository.findByToken(token);

		if (!invite) {
			throw new NotFoundException("Invite not found");
		}

		if (invite.acceptedAt) {
			throw new ConflictException("This invite has already been accepted");
		}

		if (invite.expiresAt.getTime() <= Date.now()) {
			throw new GoneException("This invite has expired");
		}

		const user = await this.usersService.findById(userId);
		if (!user) {
			throw new NotFoundException("User not found");
		}

		if (user.email.toLowerCase() !== invite.email.toLowerCase()) {
			throw new ForbiddenException("This invite was issued to a different email address");
		}

		const workspace = await this.workspacesService.findById(invite.workspaceId);
		if (!workspace) {
			throw new NotFoundException("Workspace not found");
		}

		const claimed = await this.workspaceInvitesRepository.claimByToken(invite.id, new Date());
		if (!claimed) {
			throw new ConflictException("This invite has already been accepted");
		}

		const existingMembership = await this.workspaceMembersService.findOneByWorkspaceAndUser(
			invite.workspaceId,
			userId,
		);

		if (!existingMembership) {
			await this.workspaceMembersService.create({
				workspaceId: invite.workspaceId,
				userId,
				role: WORKSPACE_INVITE_ROLE_TO_MEMBER_ROLE[invite.role],
				actorId: userId,
			});
		}

		return workspace;
	}

	private async assertNotAlreadyMember(workspaceId: string, email: string): Promise<void> {
		const invitedUser = await this.usersService.findByEmailInsensitive(email);
		if (!invitedUser) return;

		const membership = await this.workspaceMembersService.findOneByWorkspaceAndUser(
			workspaceId,
			invitedUser.id,
		);

		if (membership) {
			throw new ConflictException("This person is already a member of the workspace");
		}
	}

	private generateToken(): string {
		return randomBytes(WORKSPACE_INVITE_TOKEN_BYTES).toString("base64url");
	}
}
