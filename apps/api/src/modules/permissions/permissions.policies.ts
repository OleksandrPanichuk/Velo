import { WorkspaceMemberRole } from "@/enums";
import { Permission } from "./permissions.constants";
import type { PolicyFn } from "./permissions.types";

const { OWNER, ADMIN, MEMBER, GUEST } = WorkspaceMemberRole;

/** Allow when the caller is a member whose workspace role is one of `roles`. */
const hasRole =
	(...roles: WorkspaceMemberRole[]): PolicyFn =>
	({ workspaceRole }) =>
		workspaceRole !== null && roles.includes(workspaceRole);

/**
 * The permission matrix. A missing/null role denies by construction
 * because `hasRole` rejects a null `workspaceRole`.
 *
 * To add an attribute-based (ABAC) rule later, write a predicate that inspects
 * the resource, e.g.:
 *
 *   [Permission.CommentUpdate]: ({ userId }, comment: CommentModel) =>
 *       comment?.authorId === userId,
 */
export const POLICIES: Record<Permission, PolicyFn> = {
	[Permission.WorkspaceUpdate]: hasRole(OWNER, ADMIN),
	[Permission.WorkspaceDelete]: hasRole(OWNER),
	[Permission.MemberInvite]: hasRole(OWNER, ADMIN),
	[Permission.MemberRemove]: hasRole(OWNER, ADMIN),
	[Permission.MemberUpdateRole]: hasRole(OWNER, ADMIN),
	[Permission.MemberRead]: hasRole(OWNER, ADMIN, MEMBER, GUEST),
};
