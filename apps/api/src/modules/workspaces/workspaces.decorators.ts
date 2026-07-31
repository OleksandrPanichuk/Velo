import { WorkspaceModel } from "@/models/Workspace.model";
import { applyDecorators } from "@nestjs/common";
import { Mutation, Query } from "@nestjs/graphql";

export const GetWorkspacesQuery = (): MethodDecorator =>
	applyDecorators(
		Query(() => [WorkspaceModel], {
			description:
				"Retrieve a list of workspaces associated with the current user. Requires authentication.",
		}),
	);

export const GetWorkspaceBySlugQuery = (): MethodDecorator =>
	applyDecorators(
		Query(() => WorkspaceModel, {
			name: "workspace",
			description:
				"Retrieve a single workspace by its slug. Only available to members of that workspace; non-members receive a not found error. Requires authentication.",
		}),
	);

export const CreateWorkspaceMutation = (): MethodDecorator =>
	applyDecorators(
		Mutation(() => WorkspaceModel, {
			description: "Create a new workspace for the current user. Requires authentication.",
		}),
	);
