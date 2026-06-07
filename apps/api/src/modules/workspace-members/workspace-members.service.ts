import { WorkspaceMemberRole } from "@/enums";
import { WorkspaceMemberModel } from "@/models/WorkspaceMember.model";
import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { CreateRootWorkspaceMemberInput, CreateWorkspaceMemberInput } from "./dto";
import { MemberJoinedEvent } from "./events";
import { WorkspaceMembersRepository } from "./workspace-members.repository";

@Injectable()
export class WorkspaceMembersService {
	constructor(
		private readonly workspaceMembersRepository: WorkspaceMembersRepository,
		private readonly eventEmitter: EventEmitter2,
	) {}

	public async create(dto: CreateWorkspaceMemberInput): Promise<WorkspaceMemberModel> {
		const member = await this.workspaceMembersRepository.create({
			workspaceId: dto.workspaceId,
			userId: dto.userId,
			role: dto.role,
		});
		await this.eventEmitter.emitAsync(
			MemberJoinedEvent.EVENT,
			new MemberJoinedEvent(dto.workspaceId, dto.userId, dto.actorId),
		);
		return member;
	}

	public async createRootMember(
		dto: CreateRootWorkspaceMemberInput,
	): Promise<WorkspaceMemberModel> {
		return this.create({ ...dto, role: WorkspaceMemberRole.OWNER, actorId: dto.userId });
	}

	public async findAdminsByWorkspaceId(workspaceId: string): Promise<WorkspaceMemberModel[]> {
		return this.workspaceMembersRepository.findAdminsByWorkspaceId(workspaceId);
	}
}
