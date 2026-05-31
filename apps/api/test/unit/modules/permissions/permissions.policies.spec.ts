import "reflect-metadata";
import { WorkspaceMemberRole } from "@/enums";
import { Permission } from "@/modules/permissions/permissions.constants";
import { POLICIES } from "@/modules/permissions/permissions.policies";
import type { PermissionSubject } from "@/modules/permissions/permissions.types";

const { OWNER, ADMIN, MEMBER, GUEST } = WorkspaceMemberRole;

const subject = (workspaceRole: WorkspaceMemberRole | null): PermissionSubject => ({
	userId: workspaceRole === null ? null : "user-1",
	workspaceRole,
});

// Mirror of spec §5 — each row is [permission, allowed roles]. Any role not
// listed (and the null/non-member case) must be denied.
const matrix: Array<[Permission, WorkspaceMemberRole[]]> = [
	[Permission.WorkspaceUpdate, [OWNER, ADMIN]],
	[Permission.WorkspaceDelete, [OWNER]],
	[Permission.MemberInvite, [OWNER, ADMIN]],
	[Permission.MemberRemove, [OWNER, ADMIN]],
	[Permission.MemberUpdateRole, [OWNER, ADMIN]],
	[Permission.MemberRead, [OWNER, ADMIN, MEMBER, GUEST]],
];

const allRoles: Array<WorkspaceMemberRole | null> = [OWNER, ADMIN, MEMBER, GUEST, null];

describe("permission policies matrix", () => {
	it("defines a policy for every permission", () => {
		for (const permission of Object.values(Permission)) {
			expect(typeof POLICIES[permission]).toBe("function");
		}
	});

	for (const [permission, allowed] of matrix) {
		for (const role of allRoles) {
			const expected = role !== null && allowed.includes(role);
			it(`${permission}: ${role ?? "non-member"} -> ${expected ? "allow" : "deny"}`, () => {
				expect(POLICIES[permission](subject(role))).toBe(expected);
			});
		}
	}
});