import type { WorkspaceMemberModel } from "@/models/WorkspaceMember.model";
import { type PermissionService } from "@/modules/permissions";
import { WorkspaceMembersResolver } from "@/modules/workspace-members/workspace-members.resolver";
import { type WorkspaceMembersService } from "@/modules/workspace-members/workspace-members.service";
import { ForbiddenException } from "@nestjs/common";

const mockWorkspaceMembersService: Partial<WorkspaceMembersService> = {
	findByWorkspaceId: vi.fn(),
};

const mockPermissionService: Partial<PermissionService> = {
	assertWorkspace: vi.fn(),
};

const buildResolver = () =>
	new WorkspaceMembersResolver(
		mockWorkspaceMembersService as WorkspaceMembersService,
		mockPermissionService as PermissionService,
	);

describe("WorkspaceMembersResolver", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("members", () => {
		it("returns the members of the workspace", async () => {
			const members = [
				{ id: "mem-1", workspaceId: "ws-1", user: { id: "u1" } },
				{ id: "mem-2", workspaceId: "ws-1", user: { id: "u2" } },
			];
			vi.mocked(mockWorkspaceMembersService.findByWorkspaceId!).mockResolvedValue(
				members as WorkspaceMemberModel[],
			);

			const result = await buildResolver().members("ws-1");

			expect(mockWorkspaceMembersService.findByWorkspaceId).toHaveBeenCalledWith("ws-1");
			expect(result).toBe(members);
		});

		it("asserts the requested workspace matches the active request context", async () => {
			vi.mocked(mockWorkspaceMembersService.findByWorkspaceId!).mockResolvedValue([]);

			await buildResolver().members("ws-1");

			expect(mockPermissionService.assertWorkspace).toHaveBeenCalledWith("ws-1");
		});

		it("does not read members when the workspace does not match the request context", async () => {
			vi.mocked(mockPermissionService.assertWorkspace!).mockImplementation(() => {
				throw new ForbiddenException();
			});

			await expect(buildResolver().members("ws-other")).rejects.toThrow(ForbiddenException);

			expect(mockWorkspaceMembersService.findByWorkspaceId).not.toHaveBeenCalled();
		});
	});
});
