vi.mock("@nestjs-cls/transactional", () => ({
	Transactional:
		() =>
		(_target: unknown, _key: string, descriptor: PropertyDescriptor) =>
			descriptor,
	TransactionHost: class {},
}));

import { WorkspaceInviteRole, WorkspaceMemberRole } from "@/enums";
import type { UserModel } from "@/models/User.model";
import type { WorkspaceInviteModel } from "@/models/WorkspaceInvite.model";
import type { WorkspaceMemberModel } from "@/models/WorkspaceMember.model";
import type { WorkspaceModel } from "@/models/Workspace.model";
import { UsersService } from "@/modules/users/users.service";
import {
	WORKSPACE_INVITE_TOKEN_BYTES,
	WORKSPACE_INVITE_TTL_MS,
} from "@/modules/workspace-invites/workspace-invites.constants";
import { WorkspaceInvitesRepository } from "@/modules/workspace-invites/workspace-invites.repository";
import { WorkspaceInvitesService } from "@/modules/workspace-invites/workspace-invites.service";
import { WorkspaceMembersService } from "@/modules/workspace-members/workspace-members.service";
import { WorkspacesService } from "@/modules/workspaces/workspaces.service";
import { MailQueue } from "@/queues/mail";
import {
	ConflictException,
	ForbiddenException,
	GoneException,
	NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const WORKSPACE = { id: "ws-1", name: "Acme", slug: "acme" } as WorkspaceModel;
const INVITER_MEMBER = { id: "mem-1", workspaceId: "ws-1", userId: "u-inviter" } as WorkspaceMemberModel;
const INVITER_USER = { id: "u-inviter", fullName: "Ada Lovelace" } as UserModel;

const mockInvitesRepository: Partial<WorkspaceInvitesRepository> = {
	findPendingByWorkspaceId: vi.fn(),
	findPendingByWorkspaceAndEmail: vi.fn(),
	findByToken: vi.fn(),
	findByIdAndWorkspaceId: vi.fn(),
	claimByToken: vi.fn(),
	findByIdWithInviter: vi.fn(),
	create: vi.fn(),
	update: vi.fn(),
	deleteById: vi.fn(),
};

const mockMembersService: Partial<WorkspaceMembersService> = {
	findOneByWorkspaceAndUser: vi.fn(),
	create: vi.fn(),
};

const mockWorkspacesService: Partial<WorkspacesService> = {
	findById: vi.fn(),
};

const mockUsersService: Partial<UsersService> = {
	findById: vi.fn(),
	findByEmailInsensitive: vi.fn(),
};

const mockMailQueue: Partial<MailQueue> = {
	enqueueWorkspaceInvite: vi.fn(),
};

const mockConfig = {
	getOrThrow: vi.fn(() => "http://localhost:4000/invite"),
} as unknown as ConfigService;

const buildService = () =>
	new WorkspaceInvitesService(
		mockInvitesRepository as WorkspaceInvitesRepository,
		mockMembersService as WorkspaceMembersService,
		mockWorkspacesService as WorkspacesService,
		mockUsersService as UsersService,
		mockMailQueue as MailQueue,
		mockConfig,
	);

const INPUT = {
	workspaceId: "ws-1",
	email: "invitee@example.com",
	role: WorkspaceInviteRole.MEMBER,
};

describe("WorkspaceInvitesService", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(mockWorkspacesService.findById!).mockResolvedValue(WORKSPACE);
		vi.mocked(mockUsersService.findById!).mockResolvedValue(INVITER_USER);
		vi.mocked(mockUsersService.findByEmailInsensitive!).mockResolvedValue(null);
		vi.mocked(mockMembersService.findOneByWorkspaceAndUser!).mockResolvedValue(INVITER_MEMBER);
		vi.mocked(mockInvitesRepository.findPendingByWorkspaceAndEmail!).mockResolvedValue(null);
		vi.mocked(mockInvitesRepository.claimByToken!).mockResolvedValue(true);
		vi.mocked(mockInvitesRepository.findByIdWithInviter!).mockResolvedValue(null);
		vi.mocked(mockInvitesRepository.create!).mockImplementation(
			async (data) => data as WorkspaceInviteModel,
		);
	});

	describe("invite", () => {
		it("issues a random token with a future expiry and emails the invite link", async () => {
			await buildService().invite(INPUT, "u-inviter");

			const created = vi.mocked(mockInvitesRepository.create!).mock.calls[0]?.[0] as {
				token: string;
				expiresAt: Date;
				email: string;
				inviterId: string;
			};

			expect(created.token).toMatch(/^[A-Za-z0-9_-]{20,}$/);
			expect(created.expiresAt.getTime()).toBeGreaterThan(Date.now());
			expect(created.inviterId).toBe(INVITER_MEMBER.id);

			expect(mockMailQueue.enqueueWorkspaceInvite).toHaveBeenCalledWith(
				"invitee@example.com",
				expect.objectContaining({
					inviteUrl: `http://localhost:4000/invite?token=${created.token}`,
					workspaceName: "Acme",
					inviterName: "Ada Lovelace",
				}),
			);
		});

		it("issues a different token on every invite", async () => {
			const service = buildService();
			await service.invite(INPUT, "u-inviter");
			await service.invite(INPUT, "u-inviter");

			const calls = vi.mocked(mockInvitesRepository.create!).mock.calls;
			const first = (calls[0]?.[0] as { token: string }).token;
			const second = (calls[1]?.[0] as { token: string }).token;

			expect(first).not.toBe(second);
		});

		it("normalizes the invited email to lower case", async () => {
			await buildService().invite({ ...INPUT, email: "Invitee@Example.COM" }, "u-inviter");

			expect(mockInvitesRepository.create).toHaveBeenCalledWith(
				expect.objectContaining({ email: "invitee@example.com" }),
			);
		});

		it("rejects inviting someone who is already a member", async () => {
			vi.mocked(mockUsersService.findByEmailInsensitive!).mockResolvedValue({ id: "u-existing" } as UserModel);
			vi.mocked(mockMembersService.findOneByWorkspaceAndUser!)
				.mockResolvedValueOnce(INVITER_MEMBER)
				.mockResolvedValueOnce({ id: "mem-existing" } as WorkspaceMemberModel);

			await expect(buildService().invite(INPUT, "u-inviter")).rejects.toThrow(ConflictException);

			expect(mockInvitesRepository.create).not.toHaveBeenCalled();
			expect(mockMailQueue.enqueueWorkspaceInvite).not.toHaveBeenCalled();
		});

		it("refreshes the pending invite instead of creating a duplicate row", async () => {
			const existing = { id: "inv-1", token: "old-token" } as WorkspaceInviteModel;
			vi.mocked(mockInvitesRepository.findPendingByWorkspaceAndEmail!).mockResolvedValue(existing);
			vi.mocked(mockInvitesRepository.update!).mockResolvedValue(existing);

			await buildService().invite(INPUT, "u-inviter");

			expect(mockInvitesRepository.create).not.toHaveBeenCalled();
			expect(mockInvitesRepository.update).toHaveBeenCalledWith(
				"inv-1",
				expect.objectContaining({ token: expect.not.stringMatching(/^old-token$/) }),
			);
			expect(mockMailQueue.enqueueWorkspaceInvite).toHaveBeenCalledTimes(1);
		});

		it("refuses to invite when the caller is not a member of the workspace", async () => {
			vi.mocked(mockMembersService.findOneByWorkspaceAndUser!).mockResolvedValue(null);

			await expect(buildService().invite(INPUT, "u-outsider")).rejects.toThrow(ForbiddenException);
		});
	});

	describe("accept", () => {
		const pendingInvite = () =>
			({
				id: "inv-1",
				workspaceId: "ws-1",
				email: "invitee@example.com",
				role: WorkspaceInviteRole.ADMIN,
				token: "tok",
				expiresAt: new Date(Date.now() + 60_000),
				acceptedAt: null,
			}) as WorkspaceInviteModel;

		beforeEach(() => {
			vi.mocked(mockUsersService.findById!).mockResolvedValue({
				id: "u-invitee",
				email: "invitee@example.com",
			} as UserModel);
			vi.mocked(mockMembersService.findOneByWorkspaceAndUser!).mockResolvedValue(null);
		});

		it("creates the membership through the members service so MemberJoinedEvent is emitted", async () => {
			vi.mocked(mockInvitesRepository.findByToken!).mockResolvedValue(pendingInvite());

			const result = await buildService().accept("tok", "u-invitee");

			expect(mockMembersService.create).toHaveBeenCalledWith({
				workspaceId: "ws-1",
				userId: "u-invitee",
				role: WorkspaceMemberRole.ADMIN,
				actorId: "u-invitee",
			});
			expect(mockInvitesRepository.claimByToken).toHaveBeenCalledWith("inv-1", expect.any(Date));
			expect(result).toBe(WORKSPACE);
		});

		it("matches the invite email case-insensitively", async () => {
			vi.mocked(mockInvitesRepository.findByToken!).mockResolvedValue(pendingInvite());
			vi.mocked(mockUsersService.findById!).mockResolvedValue({
				id: "u-invitee",
				email: "INVITEE@example.com",
			} as UserModel);

			await expect(buildService().accept("tok", "u-invitee")).resolves.toBe(WORKSPACE);
		});

		it("refuses a leaked link redeemed by a different account", async () => {
			vi.mocked(mockInvitesRepository.findByToken!).mockResolvedValue(pendingInvite());
			vi.mocked(mockUsersService.findById!).mockResolvedValue({
				id: "u-attacker",
				email: "attacker@example.com",
			} as UserModel);

			await expect(buildService().accept("tok", "u-attacker")).rejects.toThrow(ForbiddenException);

			expect(mockMembersService.create).not.toHaveBeenCalled();
			expect(mockInvitesRepository.claimByToken).not.toHaveBeenCalled();
		});

		it("rejects an expired invite", async () => {
			vi.mocked(mockInvitesRepository.findByToken!).mockResolvedValue({
				...pendingInvite(),
				expiresAt: new Date(Date.now() - 1),
			} as WorkspaceInviteModel);

			await expect(buildService().accept("tok", "u-invitee")).rejects.toThrow(GoneException);

			expect(mockMembersService.create).not.toHaveBeenCalled();
		});

		it("rejects an already accepted invite", async () => {
			vi.mocked(mockInvitesRepository.findByToken!).mockResolvedValue({
				...pendingInvite(),
				acceptedAt: new Date(),
			} as WorkspaceInviteModel);

			await expect(buildService().accept("tok", "u-invitee")).rejects.toThrow(ConflictException);

			expect(mockMembersService.create).not.toHaveBeenCalled();
		});

		it("retires the invite without duplicating an existing membership", async () => {
			vi.mocked(mockInvitesRepository.findByToken!).mockResolvedValue(pendingInvite());
			vi.mocked(mockMembersService.findOneByWorkspaceAndUser!).mockResolvedValue({
				id: "mem-existing",
			} as WorkspaceMemberModel);

			await expect(buildService().accept("tok", "u-invitee")).resolves.toBe(WORKSPACE);

			expect(mockMembersService.create).not.toHaveBeenCalled();
			expect(mockInvitesRepository.claimByToken).toHaveBeenCalledWith("inv-1", expect.any(Date));
		});
	});

	describe("revoke", () => {
		it("revokes a pending invite scoped to the workspace", async () => {
			vi.mocked(mockInvitesRepository.findByIdAndWorkspaceId!).mockResolvedValue({
				id: "inv-1",
				acceptedAt: null,
			} as WorkspaceInviteModel);

			await expect(buildService().revoke("inv-1", "ws-1")).resolves.toBe(true);

			expect(mockInvitesRepository.findByIdAndWorkspaceId).toHaveBeenCalledWith("inv-1", "ws-1");
			expect(mockInvitesRepository.deleteById).toHaveBeenCalledWith("inv-1");
		});

		it("refuses to revoke an invite belonging to another workspace", async () => {
			vi.mocked(mockInvitesRepository.findByIdAndWorkspaceId!).mockResolvedValue(null);

			await expect(buildService().revoke("inv-1", "ws-other")).rejects.toThrow();

			expect(mockInvitesRepository.deleteById).not.toHaveBeenCalled();
		});

		it("refuses to revoke an invite that was already accepted", async () => {
			vi.mocked(mockInvitesRepository.findByIdAndWorkspaceId!).mockResolvedValue({
				id: "inv-1",
				acceptedAt: new Date(),
			} as WorkspaceInviteModel);

			await expect(buildService().revoke("inv-1", "ws-1")).rejects.toThrow(ConflictException);

			expect(mockInvitesRepository.deleteById).not.toHaveBeenCalled();
		});
	});
});

describe("WorkspaceInvitesService — specified rules not covered above", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(mockWorkspacesService.findById!).mockResolvedValue(WORKSPACE);
		vi.mocked(mockUsersService.findByEmailInsensitive!).mockResolvedValue(null);
		vi.mocked(mockMembersService.findOneByWorkspaceAndUser!).mockResolvedValue(INVITER_MEMBER);
		vi.mocked(mockInvitesRepository.findPendingByWorkspaceAndEmail!).mockResolvedValue(null);
		vi.mocked(mockInvitesRepository.claimByToken!).mockResolvedValue(true);
		vi.mocked(mockInvitesRepository.findByIdWithInviter!).mockResolvedValue(null);
		vi.mocked(mockInvitesRepository.create!).mockImplementation(
			async (data) => data as WorkspaceInviteModel,
		);
	});

	it("expires the invite exactly WORKSPACE_INVITE_TTL_MS from now", async () => {
		const before = Date.now();
		await buildService().invite(INPUT, "u-inviter");
		const after = Date.now();

		const { expiresAt } = vi.mocked(mockInvitesRepository.create!).mock.calls[0]?.[0] as {
			expiresAt: Date;
		};

		expect(expiresAt.getTime()).toBeGreaterThanOrEqual(before + WORKSPACE_INVITE_TTL_MS);
		expect(expiresAt.getTime()).toBeLessThanOrEqual(after + WORKSPACE_INVITE_TTL_MS);
	});

	it("issues a token with the full specified entropy", async () => {
		await buildService().invite(INPUT, "u-inviter");

		const { token } = vi.mocked(mockInvitesRepository.create!).mock.calls[0]?.[0] as {
			token: string;
		};

		expect(Buffer.from(token, "base64url")).toHaveLength(WORKSPACE_INVITE_TOKEN_BYTES);
	});

	it("rejects inviting into a workspace that does not exist", async () => {
		vi.mocked(mockWorkspacesService.findById!).mockResolvedValue(null);

		await expect(buildService().invite(INPUT, "u-inviter")).rejects.toThrow(NotFoundException);

		expect(mockInvitesRepository.create).not.toHaveBeenCalled();
	});

	it("finds an existing member case-insensitively before inviting", async () => {
		await buildService().invite({ ...INPUT, email: "Invitee@Example.COM" }, "u-inviter");

		expect(mockUsersService.findByEmailInsensitive).toHaveBeenCalledWith("invitee@example.com");
	});

	it("rejects an unknown invite token", async () => {
		vi.mocked(mockInvitesRepository.findByToken!).mockResolvedValue(null);

		await expect(buildService().accept("nope", "u-invitee")).rejects.toThrow(NotFoundException);

		expect(mockMembersService.create).not.toHaveBeenCalled();
	});

	it("loses the race gracefully when a concurrent accept already claimed the invite", async () => {
		vi.mocked(mockInvitesRepository.findByToken!).mockResolvedValue({
			id: "inv-1",
			workspaceId: "ws-1",
			email: "invitee@example.com",
			role: WorkspaceInviteRole.MEMBER,
			expiresAt: new Date(Date.now() + 60_000),
			acceptedAt: null,
		} as WorkspaceInviteModel);
		vi.mocked(mockUsersService.findById!).mockResolvedValue({
			id: "u-invitee",
			email: "invitee@example.com",
		} as UserModel);
		vi.mocked(mockMembersService.findOneByWorkspaceAndUser!).mockResolvedValue(null);
		vi.mocked(mockInvitesRepository.claimByToken!).mockResolvedValue(false);

		await expect(buildService().accept("tok", "u-invitee")).rejects.toThrow(ConflictException);

		expect(mockMembersService.create).not.toHaveBeenCalled();
	});
});
