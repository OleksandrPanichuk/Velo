import { type WorkspaceMemberRole } from "@/enums";

export interface CreateRootWorkspaceMemberInput {
	workspaceId: string;
	userId: string;
}

export interface CreateWorkspaceMemberInput extends CreateRootWorkspaceMemberInput {
	role: WorkspaceMemberRole;
	actorId: string;
}
