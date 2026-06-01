import type { WorkspaceContext } from "@/modules/permissions/permissions.types";
import type { ServerResponse } from "node:http";
import type { ClsStore } from "nestjs-cls";

export interface AppClsStore extends ClsStore {
	userId?: string;
	response?: ServerResponse;
	workspaceContext?: WorkspaceContext;
}