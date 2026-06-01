import { applyDecorators } from "@nestjs/common";
import { Mutation, Query } from "@nestjs/graphql";
import { WorkspaceModel } from "@/models/Workspace.model";

export const GetWorkspacesByUserIdQuery = (): MethodDecorator =>
	applyDecorators(
		Query(() => [WorkspaceModel], {
			description:
				"Retrieve a list of workspaces associated with the current user. Requires authentication.",
		}),
	);

export const CreateWorkspaceMutation = (): MethodDecorator =>
	applyDecorators(
		Mutation(() => WorkspaceModel, {
			description: "Create a new workspace for the current user. Requires authentication.",
		}),
	);
