import { WorkspaceInviteModel } from "@/models/WorkspaceInvite.model";
import { BaseRepository } from "@/shared/repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, MoreThan, Repository } from "typeorm";

export interface CreateWorkspaceInviteData {
	workspaceId: string;
	email: string;
	role: WorkspaceInviteModel["role"];
	token: string;
	expiresAt: Date;
	inviterId: string;
}

@Injectable()
export class WorkspaceInvitesRepository extends BaseRepository<WorkspaceInviteModel> {
	constructor(@InjectRepository(WorkspaceInviteModel) repo: Repository<WorkspaceInviteModel>) {
		super(repo);
	}

	public async findPendingByWorkspaceId(workspaceId: string): Promise<WorkspaceInviteModel[]> {
		return this.em.find(this.repo.target, {
			relations: { inviter: { user: true } },
			where: {
				workspaceId,
				acceptedAt: IsNull(),
				expiresAt: MoreThan(new Date()),
			},
			order: { createdAt: "DESC" },
		});
	}

	public async findPendingByWorkspaceAndEmail(
		workspaceId: string,
		email: string,
	): Promise<WorkspaceInviteModel | null> {
		return this.em.findOne(this.repo.target, {
			where: {
				workspaceId,
				email,
				acceptedAt: IsNull(),
				expiresAt: MoreThan(new Date()),
			},
		});
	}

	public async findByIdWithInviter(id: string): Promise<WorkspaceInviteModel | null> {
		return this.em.findOne(this.repo.target, {
			relations: { inviter: { user: true } },
			where: { id },
		});
	}

	public async findByToken(token: string): Promise<WorkspaceInviteModel | null> {
		return this.em.findOne(this.repo.target, { where: { token } });
	}

	public async findByIdAndWorkspaceId(
		id: string,
		workspaceId: string,
	): Promise<WorkspaceInviteModel | null> {
		return this.em.findOne(this.repo.target, { where: { id, workspaceId } });
	}

	/**
	 * Claims the invite only if it is still unaccepted, so two concurrent accepts
	 * of the same token cannot both proceed. Returns false when another request won.
	 */
	public async claimByToken(id: string, acceptedAt: Date): Promise<boolean> {
		const result = await this.em.update(
			this.repo.target,
			{ id, acceptedAt: IsNull() },
			{ acceptedAt },
		);

		return result.affected === 1;
	}

	/** Hard delete: WorkspaceInviteModel has no `deletedAt`, so softDelete would throw. */
	public async deleteById(id: string): Promise<void> {
		await this.em.delete(this.repo.target, { id });
	}
}
