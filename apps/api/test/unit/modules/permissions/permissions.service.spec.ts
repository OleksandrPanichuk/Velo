import "reflect-metadata";
import { WorkspaceMemberRole } from "@/enums";
import { Permission } from "@/modules/permissions/permissions.constants";
import { PermissionService } from "@/modules/permissions/permissions.service";
import type { WorkspaceContext } from "@/modules/permissions/permissions.types";
import { ForbiddenException } from "@nestjs/common";

// Mock the policy registry so the service test verifies delegation + subject
// construction in isolation. The real matrix is covered by permissions.policies.spec.
const memberInvitePolicy = vi.fn();
vi.mock("@/modules/permissions/permissions.policies", () => ({
	POLICIES: {
		"member.invite": (...args: unknown[]) => memberInvitePolicy(...args),
	},
}));

const serviceWith = (workspaceContext: WorkspaceContext | undefined) => {
	const cls = { workspaceContext };
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return new PermissionService(cls as any);
};

const adminContext: WorkspaceContext = {
	workspaceId: "ws-1",
	member: { userId: "user-1", role: WorkspaceMemberRole.ADMIN },
};

beforeEach(() => {
	memberInvitePolicy.mockReset();
});

describe("PermissionService", () => {
	describe("can", () => {
		it("builds the subject from the cached member and forwards the resource", () => {
			memberInvitePolicy.mockReturnValue(true);
			const service = serviceWith(adminContext);
			const resource = { id: "x" };

			const result = service.can(Permission.MemberInvite, resource);

			expect(result).toBe(true);
			expect(memberInvitePolicy).toHaveBeenCalledWith(
				{ userId: "user-1", workspaceRole: WorkspaceMemberRole.ADMIN },
				resource,
			);
		});

		it("builds a null subject when there is no workspace context", () => {
			memberInvitePolicy.mockReturnValue(false);
			const service = serviceWith(undefined);

			service.can(Permission.MemberInvite);

			expect(memberInvitePolicy).toHaveBeenCalledWith(
				{ userId: null, workspaceRole: null },
				undefined,
			);
		});

		it("builds a null subject when the caller is not a member", () => {
			memberInvitePolicy.mockReturnValue(false);
			const service = serviceWith({ workspaceId: "ws-1", member: null });

			service.can(Permission.MemberInvite);

			expect(memberInvitePolicy).toHaveBeenCalledWith(
				{ userId: null, workspaceRole: null },
				undefined,
			);
		});

		it("returns the policy decision", () => {
			memberInvitePolicy.mockReturnValue(false);
			expect(serviceWith(adminContext).can(Permission.MemberInvite)).toBe(false);
		});
	});

	describe("assert", () => {
		it("does nothing when allowed", () => {
			memberInvitePolicy.mockReturnValue(true);
			const service = serviceWith(adminContext);
			expect(() => service.assert(Permission.MemberInvite)).not.toThrow();
		});

		it("throws ForbiddenException when denied", () => {
			memberInvitePolicy.mockReturnValue(false);
			const service = serviceWith(adminContext);
			expect(() => service.assert(Permission.MemberInvite)).toThrow(ForbiddenException);
		});
	});
});