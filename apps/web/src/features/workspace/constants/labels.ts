import type { WorkspaceMemberRole, WorkspaceSize } from "@/graphql/types";

export const WORKSPACE_SIZE_LABELS: Record<WorkspaceSize, string> = {
	SMALL: "1–10 people",
	MEDIUM: "11–50 people",
	LARGE: "51–200 people",
	ENTERPRISE: "200+ people",
};

export const MEMBER_ROLE_LABELS: Record<WorkspaceMemberRole, string> = {
	OWNER: "Owner",
	ADMIN: "Admin",
	MEMBER: "Member",
	GUEST: "Guest",
};

export const INVITE_MANAGING_ROLES: readonly WorkspaceMemberRole[] = ["OWNER", "ADMIN"];
