import { WorkspaceInviteRole } from "@/enums";
import type { WorkspaceInviteModel } from "@/models/WorkspaceInvite.model";
import type { WorkspaceModel } from "@/models/Workspace.model";
import { type PermissionService } from "@/modules/permissions";
import { WorkspaceInvitesResolver } from "@/modules/workspace-invites/workspace-invites.resolver";
import { type WorkspaceInvitesService } from "@/modules/workspace-invites/workspace-invites.service";
import { ForbiddenException } from "@nestjs/common";

const mockInvitesService: Partial<WorkspaceInvitesService> = {
	findPending: vi.fn(),
	invite: vi.fn(),
	revoke: vi.fn(),
	accept: vi.fn(),
};

const mockPermissionService: Partial<PermissionService> = {
	assertWorkspace: vi.fn(),
	getActiveWorkspaceId: vi.fn(),
};

const buildResolver = () =>
	new WorkspaceInvitesResolver(
		mockInvitesService as WorkspaceInvitesService,
		mockPermissionService as PermissionService,
	);

const INPUT = {
	workspaceId: "ws-1",
	email: "invitee@example.com",
	role: WorkspaceInviteRole.MEMBER,
};

const denyWorkspace = () =>
	vi.mocked(mockPermissionService.assertWorkspace!).mockImplementation(() => {
		throw new ForbiddenException();
	});

describe("WorkspaceInvitesResolver", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(mockPermissionService.assertWorkspace!).mockImplementation(() => undefined);
		vi.mocked(mockPermissionService.getActiveWorkspaceId!).mockReturnValue("ws-1");
	});

	describe("pendingInvites", () => {
		it("asserts the argument workspace matches the request context", async () => {
			vi.mocked(mockInvitesService.findPending!).mockResolvedValue([]);

			await buildResolver().pendingInvites("ws-1");

			expect(mockPermissionService.assertWorkspace).toHaveBeenCalledWith("ws-1");
			expect(mockInvitesService.findPending).toHaveBeenCalledWith("ws-1");
		});

		it("does not read another workspace's invites", async () => {
			denyWorkspace();

			await expect(buildResolver().pendingInvites("ws-other")).rejects.toThrow(ForbiddenException);

			expect(mockInvitesService.findPending).not.toHaveBeenCalled();
		});
	});

	describe("inviteMember", () => {
		it("asserts the input workspace matches the request context", async () => {
			vi.mocked(mockInvitesService.invite!).mockResolvedValue({} as WorkspaceInviteModel);

			await buildResolver().inviteMember("u-1", INPUT);

			expect(mockPermissionService.assertWorkspace).toHaveBeenCalledWith("ws-1");
			expect(mockInvitesService.invite).toHaveBeenCalledWith(INPUT, "u-1");
		});

		it("does not invite into another workspace", async () => {
			denyWorkspace();

			await expect(
				buildResolver().inviteMember("u-1", { ...INPUT, workspaceId: "ws-other" }),
			).rejects.toThrow(ForbiddenException);

			expect(mockInvitesService.invite).not.toHaveBeenCalled();
		});
	});

	describe("revokeInvite", () => {
		it("scopes the revoke to the active workspace rather than trusting the id alone", async () => {
			vi.mocked(mockInvitesService.revoke!).mockResolvedValue(true);

			await buildResolver().revokeInvite("inv-1");

			expect(mockInvitesService.revoke).toHaveBeenCalledWith("inv-1", "ws-1");
		});

		it("refuses to revoke when the request has no active workspace", async () => {
			vi.mocked(mockPermissionService.getActiveWorkspaceId!).mockImplementation(() => {
				throw new ForbiddenException();
			});

			await expect(buildResolver().revokeInvite("inv-1")).rejects.toThrow(ForbiddenException);

			expect(mockInvitesService.revoke).not.toHaveBeenCalled();
		});
	});

	describe("acceptInvite", () => {
		it("requires no workspace context, since the caller is not a member yet", async () => {
			vi.mocked(mockInvitesService.accept!).mockResolvedValue({} as WorkspaceModel);

			await buildResolver().acceptInvite("u-1", "tok");

			expect(mockPermissionService.assertWorkspace).not.toHaveBeenCalled();
			expect(mockPermissionService.getActiveWorkspaceId).not.toHaveBeenCalled();
			expect(mockInvitesService.accept).toHaveBeenCalledWith("tok", "u-1");
		});
	});
});
