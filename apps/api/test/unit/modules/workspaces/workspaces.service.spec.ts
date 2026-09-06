vi.mock("@nestjs-cls/transactional", () => ({
	Transactional: () => (_target: unknown, _key: string, descriptor: PropertyDescriptor) =>
		descriptor,
	TransactionHost: class {},
}));

import { type WorkspaceModel } from "@/models/Workspace.model";
import { type WorkspaceMembersService } from "@/modules/workspace-members/workspace-members.service";
import { type UsersService } from "@/modules/users/users.service";
import { WorkspacesService } from "@/modules/workspaces/workspaces.service";
import { type WorkspacesRepository } from "@/modules/workspaces/workspaces.repository";
import { ConflictException, NotFoundException } from "@nestjs/common";

const mockWorkspacesRepository: Partial<WorkspacesRepository> = {
	findByUserId: vi.fn(),
	findBySlug: vi.fn(),
	findBySlugForMember: vi.fn(),
	create: vi.fn(),
};

const mockWorkspaceMembersService: Partial<WorkspaceMembersService> = {
	createRootMember: vi.fn(),
};

const mockUsersService: Partial<UsersService> = {
	update: vi.fn(),
};

const buildService = () =>
	new WorkspacesService(
		mockWorkspacesRepository as WorkspacesRepository,
		mockWorkspaceMembersService as WorkspaceMembersService,
		mockUsersService as UsersService,
	);

describe("WorkspacesService", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("findByUserId", () => {
		it("delegates to repository", async () => {
			const workspaces = [{ id: "ws1" }];
			vi.mocked(mockWorkspacesRepository.findByUserId!).mockResolvedValue(
				workspaces as WorkspaceModel[],
			);

			const result = await buildService().findByUserId("u1");

			expect(mockWorkspacesRepository.findByUserId).toHaveBeenCalledWith("u1");
			expect(result).toBe(workspaces);
		});
	});

	describe("findBySlug", () => {
		it("returns workspace when found", async () => {
			const workspace = { id: "ws1", slug: "my-ws" };
			vi.mocked(mockWorkspacesRepository.findBySlug!).mockResolvedValue(
				workspace as WorkspaceModel,
			);

			const result = await buildService().findBySlug("my-ws");

			expect(mockWorkspacesRepository.findBySlug).toHaveBeenCalledWith("my-ws");
			expect(result).toBe(workspace);
		});

		it("returns null when not found", async () => {
			vi.mocked(mockWorkspacesRepository.findBySlug!).mockResolvedValue(null);

			const result = await buildService().findBySlug("missing");

			expect(result).toBeNull();
		});
	});

	describe("findBySlugForMember (backs the getWorkspaceBySlug query)", () => {
		it("returns the workspace when the caller is a member", async () => {
			const workspace = { id: "ws1", slug: "my-ws" };
			vi.mocked(mockWorkspacesRepository.findBySlugForMember!).mockResolvedValue(
				workspace as WorkspaceModel,
			);

			const result = await buildService().findBySlugForMember("my-ws", "u1");

			expect(mockWorkspacesRepository.findBySlugForMember).toHaveBeenCalledWith("my-ws", "u1");
			expect(result).toBe(workspace);
		});

		it("throws NotFoundException when the caller is not a member", async () => {
			vi.mocked(mockWorkspacesRepository.findBySlugForMember!).mockResolvedValue(null);

			await expect(buildService().findBySlugForMember("my-ws", "outsider")).rejects.toThrow(
				NotFoundException,
			);
		});

		it("throws NotFoundException for an unknown slug", async () => {
			vi.mocked(mockWorkspacesRepository.findBySlugForMember!).mockResolvedValue(null);

			await expect(buildService().findBySlugForMember("missing", "u1")).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe("create", () => {
		it("throws ConflictException if slug is already taken", async () => {
			vi.mocked(mockWorkspacesRepository.findBySlug!).mockResolvedValue({
				id: "ws1",
			} as WorkspaceModel);

			await expect(buildService().create({ name: "My WS", slug: "taken" }, "u1")).rejects.toThrow(
				ConflictException,
			);
		});

		it("creates workspace and root member, returns workspace", async () => {
			const workspace = { id: "ws1", name: "My WS", slug: "my-ws" };
			vi.mocked(mockWorkspacesRepository.findBySlug!).mockResolvedValue(null);
			vi.mocked(mockWorkspacesRepository.create!).mockResolvedValue(workspace as WorkspaceModel);
			vi.mocked(mockWorkspaceMembersService.createRootMember!).mockResolvedValue({} as never);

			const result = await buildService().create({ name: "My WS", slug: "my-ws" }, "u1");

			expect(mockWorkspacesRepository.create).toHaveBeenCalledWith(
				expect.objectContaining({ name: "My WS", slug: "my-ws" }),
			);
			expect(mockWorkspaceMembersService.createRootMember).toHaveBeenCalledWith({
				workspaceId: "ws1",
				userId: "u1",
			});
			expect(result).toBe(workspace);
		});

		it("updates user jobRole when provided", async () => {
			const workspace = { id: "ws1", name: "My WS", slug: "my-ws" };
			vi.mocked(mockWorkspacesRepository.findBySlug!).mockResolvedValue(null);
			vi.mocked(mockWorkspacesRepository.create!).mockResolvedValue(workspace as WorkspaceModel);
			vi.mocked(mockWorkspaceMembersService.createRootMember!).mockResolvedValue({} as never);
			vi.mocked(mockUsersService.update!).mockResolvedValue({} as never);

			await buildService().create(
				{ name: "My WS", slug: "my-ws", jobRole: "developer" as never },
				"u1",
			);

			expect(mockUsersService.update).toHaveBeenCalledWith("u1", { jobRole: "developer" });
		});

		it("does not update user jobRole when not provided", async () => {
			const workspace = { id: "ws1" };
			vi.mocked(mockWorkspacesRepository.findBySlug!).mockResolvedValue(null);
			vi.mocked(mockWorkspacesRepository.create!).mockResolvedValue(workspace as WorkspaceModel);
			vi.mocked(mockWorkspaceMembersService.createRootMember!).mockResolvedValue({} as never);

			await buildService().create({ name: "My WS", slug: "my-ws" }, "u1");

			expect(mockUsersService.update).not.toHaveBeenCalled();
		});
	});
});
