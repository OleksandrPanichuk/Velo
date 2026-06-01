import { registerEnumType } from "@nestjs/graphql";

export enum WorkspaceSize {
	SMALL = "small",
	MEDIUM = "medium",
	LARGE = "large",
	ENTERPRISE = "enterprise",
}

registerEnumType(WorkspaceSize, {
	name: "WorkspaceSize",
	description: "The size of the workspace team",
});
