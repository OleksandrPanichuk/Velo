import { Args, Resolver } from "@nestjs/graphql";
import { WorkspacesService } from "./workspaces.service";
import { WorkspaceModel } from "@/models/Workspace.model";
import { CurrentUser } from "@/shared/decorators";
import { CreateWorkspaceInput } from "@/modules/workspaces/workspaces.dto";
import {
	CreateWorkspaceMutation,
	GetWorkspacesByUserIdQuery,
} from "@/modules/workspaces/workspaces.decorators";

@Resolver()
export class WorkspacesResolver {
	constructor(private readonly workspacesService: WorkspacesService) {}

	@GetWorkspacesByUserIdQuery()
	public async getWorkspacesByUserId(@CurrentUser("id") userId: string): Promise<WorkspaceModel[]> {
		return this.workspacesService.findByUserId(userId);
	}

	@CreateWorkspaceMutation()
	public async createWorkspace(
		@Args("input") input: CreateWorkspaceInput,
		@CurrentUser("id") userId: string,
	): Promise<WorkspaceModel> {
		return this.workspacesService.create(input, userId);
	}
}
