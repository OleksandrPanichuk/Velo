import { WorkspaceMemberModel } from "@/models/WorkspaceMember.model";
import { applyDecorators } from "@nestjs/common";
import { Query } from "@nestjs/graphql";

export const GetWorkspaceMembersQuery = (): MethodDecorator =>
	applyDecorators(
		Query(() => [WorkspaceMemberModel], {
			description:
				"Retrieve all members of a workspace together with their user profiles. Requires the member.read permission in the active workspace.",
		}),
	);
