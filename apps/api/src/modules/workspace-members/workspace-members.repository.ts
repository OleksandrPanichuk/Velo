import { WorkspaceMemberRole } from "@/enums";
import { WorkspaceMemberModel } from "@/models/WorkspaceMember.model";
import { BaseRepository } from "@/shared/repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

@Injectable()
export class WorkspaceMembersRepository extends BaseRepository<WorkspaceMemberModel> {
	constructor(@InjectRepository(WorkspaceMemberModel) repo: Repository<WorkspaceMemberModel>) {
		super(repo);
	}

	public async findByWorkspaceId(workspaceId: string): Promise<WorkspaceMemberModel[]> {
		return this.em.find(this.repo.target, {
			relations: { user: true, workspace: true },
			where: { workspaceId },
			order: { joinedAt: "ASC" },
		});
	}

	public async findOneByWorkspaceAndUser(
		workspaceId: string,
		userId: string,
	): Promise<WorkspaceMemberModel | null> {
		return this.em.findOne(this.repo.target, {
			where: { workspaceId, userId },
		});
	}

	public async findAdminsByWorkspaceId(workspaceId: string): Promise<WorkspaceMemberModel[]> {
		return this.em.find(this.repo.target, {
			where: {
				workspaceId,
				role: In([WorkspaceMemberRole.OWNER, WorkspaceMemberRole.ADMIN]),
			},
		});
	}
}
