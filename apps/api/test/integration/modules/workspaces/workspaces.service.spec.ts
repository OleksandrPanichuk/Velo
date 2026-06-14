/**
 * Integration test for WorkspacesService.
 *
 * Uses real WorkspacesService + real WorkspaceMembersService wired together.
 * Mocks only repositories and EventEmitter2 (no DB or event bus needed).
 * Validates cross-service coordination: workspace creation triggers root-member setup.
 */
vi.mock("@nestjs-cls/transactional", () => ({
	Transactional:
		() =>
		(_target: unknown, _key: string, descriptor: PropertyDescriptor) =>
			descriptor,
	TransactionHost: class {},
}));

import { WorkspaceMemberModel } from "@/models/WorkspaceMember.model";
import { WorkspaceModel } from "@/models/Workspace.model";
import { WorkspaceMembersRepository } from "@/modules/workspace-members/workspace-members.repository";
import { WorkspaceMembersService } from "@/modules/workspace-members/workspace-members.service";
import { UsersService } from "@/modules/users/users.service";
import { WorkspacesRepository } from "@/modules/workspaces/workspaces.repository";
import { WorkspacesService } from "@/modules/workspaces/workspaces.service";
import { UsersRepository } from "@/modules/users/users.repository";
import { PaginationService } from "@/shared/pagination";
import { ConflictException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { EventEmitter2 } from "@nestjs/event-emitter";

const mockWorkspacesRepository: Partial<WorkspacesRepository> = {
	findByUserId: vi.fn(),
	findBySlug: vi.fn(),
	create: vi.fn(),
};

const mockWorkspaceMembersRepository: Partial<WorkspaceMembersRepository> = {
	create: vi.fn(),
	findAdminsByWorkspaceId: vi.fn(),
};

const mockUsersRepository: Partial<UsersRepository> = {
	findAll: vi.fn(),
	findById: vi.fn(),
	findByIds: vi.fn(),
	update: vi.fn(),
	createQueryBuilder: vi.fn(),
};

const mockEventEmitter: Partial<EventEmitter2> = {
	emitAsync: vi.fn().mockResolvedValue([]),
};

let module: TestingModule;
let workspacesService: WorkspacesService;
let workspaceMembersService: WorkspaceMembersService;

beforeAll(async () => {
	module = await Test.createTestingModule({
		providers: [
			WorkspacesService,
			WorkspaceMembersService,
			UsersService,
			PaginationService,
			{ provide: WorkspacesRepository, useValue: mockWorkspacesRepository },
			{ provide: WorkspaceMembersRepository, useValue: mockWorkspaceMembersRepository },
			{ provide: UsersRepository, useValue: mockUsersRepository },
			{ provide: EventEmitter2, useValue: mockEventEmitter },
		],
	}).compile();

	workspacesService = module.get(WorkspacesService);
	workspaceMembersService = module.get(WorkspaceMembersService);
});

afterAll(async () => {
	await module.close();
});

beforeEach(() => vi.clearAllMocks());

describe("WorkspacesService integration", () => {
	describe("create", () => {
		it("throws ConflictException when slug is already taken", async () => {
			vi.mocked(mockWorkspacesRepository.findBySlug!).mockResolvedValue({
				id: "ws-existing",
			} as WorkspaceModel);

			await expect(
				workspacesService.create({ name: "My WS", slug: "taken" }, "u1"),
			).rejects.toThrow(ConflictException);

			expect(mockWorkspacesRepository.create).not.toHaveBeenCalled();
		});

		it("creates workspace and root member in sequence", async () => {
			const workspace = { id: "ws-1", name: "My WS", slug: "my-ws" };
			vi.mocked(mockWorkspacesRepository.findBySlug!).mockResolvedValue(null);
			vi.mocked(mockWorkspacesRepository.create!).mockResolvedValue(workspace as WorkspaceModel);
			vi.mocked(mockWorkspaceMembersRepository.create!).mockResolvedValue({} as WorkspaceMemberModel);

			const result = await workspacesService.create({ name: "My WS", slug: "my-ws" }, "u1");

			expect(result).toBe(workspace);

			expect(mockWorkspaceMembersRepository.create).toHaveBeenCalledWith(
				expect.objectContaining({
					workspaceId: "ws-1",
					userId: "u1",
				}),
			);
		});

		it("emits MemberJoinedEvent when root member is created", async () => {
			const workspace = { id: "ws-2" };
			vi.mocked(mockWorkspacesRepository.findBySlug!).mockResolvedValue(null);
			vi.mocked(mockWorkspacesRepository.create!).mockResolvedValue(workspace as WorkspaceModel);
			vi.mocked(mockWorkspaceMembersRepository.create!).mockResolvedValue({} as WorkspaceMemberModel);

			await workspacesService.create({ name: "WS", slug: "ws-2" }, "u2");

			expect(mockEventEmitter.emitAsync).toHaveBeenCalled();
		});

		it("updates user jobRole through real UsersService when provided", async () => {
			const workspace = { id: "ws-3" };
			vi.mocked(mockWorkspacesRepository.findBySlug!).mockResolvedValue(null);
			vi.mocked(mockWorkspacesRepository.create!).mockResolvedValue(workspace as WorkspaceModel);
			vi.mocked(mockWorkspaceMembersRepository.create!).mockResolvedValue({} as WorkspaceMemberModel);
			vi.mocked(mockUsersRepository.update!).mockResolvedValue({} as never);

			await workspacesService.create(
				{ name: "WS", slug: "ws-3", jobRole: "engineer" as never },
				"u3",
			);

			expect(mockUsersRepository.update).toHaveBeenCalledWith("u3", { jobRole: "engineer" });
		});

		it("does not update jobRole when not provided", async () => {
			const workspace = { id: "ws-4" };
			vi.mocked(mockWorkspacesRepository.findBySlug!).mockResolvedValue(null);
			vi.mocked(mockWorkspacesRepository.create!).mockResolvedValue(workspace as WorkspaceModel);
			vi.mocked(mockWorkspaceMembersRepository.create!).mockResolvedValue({} as WorkspaceMemberModel);

			await workspacesService.create({ name: "WS", slug: "ws-4" }, "u4");

			expect(mockUsersRepository.update).not.toHaveBeenCalled();
		});
	});

	describe("findByUserId", () => {
		it("returns workspaces for the given user", async () => {
			const workspaces = [{ id: "ws-1" }, { id: "ws-2" }];
			vi.mocked(mockWorkspacesRepository.findByUserId!).mockResolvedValue(
				workspaces as WorkspaceModel[],
			);

			const result = await workspacesService.findByUserId("u1");

			expect(result).toBe(workspaces);
		});
	});
});
