import { WorkspaceModel } from "@/models/Workspace.model";
import { BaseRepository } from "@/shared/repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class WorkspacesRepository extends BaseRepository<WorkspaceModel> {
	constructor(@InjectRepository(WorkspaceModel) repo: Repository<WorkspaceModel>) {
		super(repo);
	}

	public async findBySlug(slug: string): Promise<WorkspaceModel | null> {
		return this.repo.findOneBy({ slug });
	}

	public async findByUserId(userId: string): Promise<WorkspaceModel[]> {
		return this.repo.findBy({ members: { userId } });
	}

	public async findBySlugForMember(slug: string, userId: string): Promise<WorkspaceModel | null> {
		return this.em.findOne(this.repo.target, {
			where: { slug, members: { userId } },
		});
	}
}
