import { registerEnumType } from "@nestjs/graphql";

export enum WorkspaceInviteRole {
	ADMIN = "admin",
	MEMBER = "member",
	GUEST = "guest",
}

registerEnumType(WorkspaceInviteRole, {
	name: "WorkspaceInviteRole",
});
