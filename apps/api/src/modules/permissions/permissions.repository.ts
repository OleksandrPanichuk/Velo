import { WorkspaceMemberRole } from "@/enums";
import { WorkspaceMemberModel } from "@/models/WorkspaceMember.model";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

/**
 * Read-only membership lookups owned by the permissions layer. Kept here (rather
 * than depending on the workspace-members module) so authorization is
 * self-contained: it only ever *reads* the role needed to make a decision.
 */
@Injectable()
export class PermissionsRepository {
	constructor(
		@InjectRepository(WorkspaceMemberModel)
		private readonly members: Repository<WorkspaceMemberModel>,
	) {}

	/** The caller's role in the workspace, or null when they are not a member. */
	public async getMemberRole(
		workspaceId: string,
		userId: string,
	): Promise<WorkspaceMemberRole | null> {
		const member = await this.members.findOne({
			where: { workspaceId, userId },
			select: { role: true },
		});
		return member?.role ?? null;
	}
}
