export const WORKSPACE_ID_HEADER = "x-workspace-id";

export function workspaceContext(workspaceId: string) {
	return { headers: { [WORKSPACE_ID_HEADER]: workspaceId } };
}
