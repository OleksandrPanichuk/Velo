import { WorkspaceInviteRole, WorkspaceMemberRole } from "@/enums";
import { days } from "@repo/primitives";

export const WORKSPACE_INVITE_TTL_MS = days(7);

export const WORKSPACE_INVITE_TOKEN_BYTES = 32;

export const WORKSPACE_INVITE_EXPIRES_IN = "7 days";

export const WORKSPACE_INVITE_EMAIL_MAX_LENGTH = 100;

export const WORKSPACE_INVITE_ROLE_TO_MEMBER_ROLE: Record<
	WorkspaceInviteRole,
	WorkspaceMemberRole
> = {
	[WorkspaceInviteRole.ADMIN]: WorkspaceMemberRole.ADMIN,
	[WorkspaceInviteRole.MEMBER]: WorkspaceMemberRole.MEMBER,
	[WorkspaceInviteRole.GUEST]: WorkspaceMemberRole.GUEST,
};
