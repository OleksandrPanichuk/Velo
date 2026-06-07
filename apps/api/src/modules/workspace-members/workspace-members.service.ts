import { WorkspaceMemberRole } from "@/enums";
import { WorkspaceMemberModel } from "@/models/WorkspaceMember.model";
import { Injectable } from "@nestjs/common";
import { CreateRootWorkspaceMemberInput, CreateWorkspaceMemberInput } from "./dto";
import { WorkspaceMembersRepository } from "./workspace-members.repository";

@Injectable()
export class WorkspaceMembersService {
	constructor(private readonly workspaceMembersRepository: WorkspaceMembersRepository) {}

	public async create(dto: CreateWorkspaceMemberInput): Promise<WorkspaceMemberModel> {
		return this.workspaceMembersRepository.create({
			workspaceId: dto.workspaceId,
			userId: dto.userId,
			role: dto.role,
		});
	}

	public async createRootMember(
		dto: CreateRootWorkspaceMemberInput,
	): Promise<WorkspaceMemberModel> {
		return this.create({
			...dto,
			role: WorkspaceMemberRole.OWNER,
		});
	}

	public async findAdminsByWorkspaceId(workspaceId: string): Promise<WorkspaceMemberModel[]> {
		return this.workspaceMembersRepository.findAdminsByWorkspaceId(workspaceId);
	}
}
