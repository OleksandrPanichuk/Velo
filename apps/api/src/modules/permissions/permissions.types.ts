import type { WorkspaceMemberRole } from "@/enums";

/**
 * The caller's identity as seen by a policy. `workspaceRole` is null when the
 * caller is not a member of the active workspace (or there is no active
 * workspace), which denies every workspace-scoped permission.
 */
export interface PermissionSubject {
	userId: string | null;
	workspaceRole: WorkspaceMemberRole | null;
}

/**
 * A policy is a pure predicate over the subject and, optionally, the resource
 * being acted on. Role-only policies ignore the resource; attribute-based
 * (ABAC) policies inspect it (e.g. `comment.authorId === subject.userId`).
 */
export type PolicyFn<TResource = unknown> = (
	subject: PermissionSubject,
	resource?: TResource,
) => boolean;

/**
 * The active workspace for a request, resolved from the `x-workspace-id`
 * header and stored in CLS. `member` is null when the caller is not a member.
 */
export interface WorkspaceContext {
	workspaceId: string;
	member: { userId: string; role: WorkspaceMemberRole } | null;
}
