/**
 * Authorization actions, named `<resource>.<action>`.
 *
 * This registry is the single source of truth for what can be authorized.
 * Today it covers the workspace + member layer; `project.*`, `issue.*`,
 * `comment.*` etc. are added here as those modules are built.
 */
export const Permission = {
	WorkspaceUpdate: "workspace.update",
	WorkspaceDelete: "workspace.delete",
	MemberInvite: "member.invite",
	MemberRemove: "member.remove",
	MemberUpdateRole: "member.updateRole",
	MemberRead: "member.read",
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];
