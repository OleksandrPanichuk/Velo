import { WorkspaceModel } from "@/models/Workspace.model";
import { UsersService } from "@/modules/users/users.service";
import { Transactional } from "@nestjs-cls/transactional";
import { ConflictException, Injectable } from "@nestjs/common";
import { WorkspaceMembersService } from "../workspace-members/workspace-members.service";
import { CreateWorkspaceInput } from "./workspaces.dto";
import { WorkspacesRepository } from "./workspaces.repository";

@Injectable()
export class WorkspacesService {
	constructor(
		private readonly workspacesRepository: WorkspacesRepository,
		private readonly workspaceMembersService: WorkspaceMembersService,
		private readonly usersService: UsersService,
	) {}

	public async findByUserId(userId: string): Promise<WorkspaceModel[]> {
		return this.workspacesRepository.findByUserId(userId);
	}

	public async findBySlug(slug: string): Promise<WorkspaceModel | null> {
		return this.workspacesRepository.findBySlug(slug);
	}

	@Transactional()
	public async create(dto: CreateWorkspaceInput, userId: string): Promise<WorkspaceModel> {
		const existingWorkspace = await this.workspacesRepository.findBySlug(dto.slug);

		if (existingWorkspace) {
			throw new ConflictException("Workspace with this slug already exists. Please try a different one.");
		}

		const workspace = await this.workspacesRepository.create({
			name: dto.name,
			slug: dto.slug,
			size: dto.size ?? null,
		});

		await this.workspaceMembersService.createRootMember({
			workspaceId: workspace.id,
			userId,
		});

		if (dto.jobRole) {
			await this.usersService.update(userId, { jobRole: dto.jobRole });
		}

		return workspace;
	}
}
