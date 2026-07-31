import { WorkspaceInviteModel } from "@/models/WorkspaceInvite.model";
import { WorkspaceModel } from "@/models/Workspace.model";
import { applyDecorators } from "@nestjs/common";
import { Mutation, Query } from "@nestjs/graphql";

export const GetPendingInvitesQuery = (): MethodDecorator =>
	applyDecorators(
		Query(() => [WorkspaceInviteModel], {
			description:
				"List the invites for a workspace that are still redeemable — neither accepted nor expired.",
		}),
	);

export const InviteMemberMutation = (): MethodDecorator =>
	applyDecorators(
		Mutation(() => WorkspaceInviteModel, {
			description:
				"Invite someone to a workspace by email. Re-inviting a pending email refreshes the existing invite and resends it.",
		}),
	);

export const RevokeInviteMutation = (): MethodDecorator =>
	applyDecorators(
		Mutation(() => Boolean, {
			description: "Revoke a pending invite so its link can no longer be redeemed.",
		}),
	);

export const AcceptInviteMutation = (): MethodDecorator =>
	applyDecorators(
		Mutation(() => WorkspaceModel, {
			description:
				"Redeem an invite token as the authenticated user and return the joined workspace. Requires authentication but no workspace context, since the caller is not a member yet.",
		}),
	);
