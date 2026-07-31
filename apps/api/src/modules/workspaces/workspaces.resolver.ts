import { WorkspaceModel } from "@/models/Workspace.model";
import {
	CreateWorkspaceMutation,
	GetWorkspacesQuery,
} from "@/modules/workspaces/workspaces.decorators";
import { CreateWorkspaceInput } from "@/modules/workspaces/workspaces.dto";
import { CurrentUser } from "@/shared/decorators";
import { Args, Resolver } from "@nestjs/graphql";
import { WorkspacesService } from "./workspaces.service";

@Resolver()
export class WorkspacesResolver {
	constructor(private readonly workspacesService: WorkspacesService) {}

	@GetWorkspacesQuery()
	public async getWorkspaces(@CurrentUser("id") userId: string): Promise<WorkspaceModel[]> {
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
