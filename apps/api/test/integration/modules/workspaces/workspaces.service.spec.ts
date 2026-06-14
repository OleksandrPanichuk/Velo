/**
 * Integration test for WorkspacesService.
 *
 * Uses real WorkspacesService + real WorkspaceMembersService wired together.
 * Mocks only repositories and EventEmitter2 (no DB or event bus needed).
 */
vi.mock("@nestjs-cls/transactional", () => ({
	Transactional:
		() =>
		(_target: unknown, _key: string, descriptor: PropertyDescriptor) =>
			descriptor,
	TransactionHost: class {},
}));

import { WorkspaceMemberRole } from "@/enums";
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
import {
	mockWorkspacesRepository,
	mockWorkspaceMembersRepository,
	mockUsersRepository,
} from "../../../helpers/mocks";
import { UserFactory, WorkspaceFactory, WorkspaceMemberFactory } from "../../../factories";

let module: TestingModule;
let workspacesService: WorkspacesService;
let wsRepo: ReturnType<typeof mockWorkspacesRepository>;
let wmRepo: ReturnType<typeof mockWorkspaceMembersRepository>;
let usersRepo: ReturnType<typeof mockUsersRepository>;

beforeAll(async () => {
	wsRepo = mockWorkspacesRepository();
	wmRepo = mockWorkspaceMembersRepository();
	usersRepo = mockUsersRepository();

	module = await Test.createTestingModule({
		providers: [
			WorkspacesService,
			WorkspaceMembersService,
			UsersService,
			PaginationService,
			{ provide: WorkspacesRepository, useValue: wsRepo },
			{ provide: WorkspaceMembersRepository, useValue: wmRepo },
			{ provide: UsersRepository, useValue: usersRepo },
			{ provide: EventEmitter2, useValue: { emitAsync: vi.fn().mockResolvedValue([]) } },
		],
	}).compile();

	workspacesService = module.get(WorkspacesService);
});

afterAll(() => module.close());
beforeEach(() => vi.clearAllMocks());

describe("WorkspacesService integration", () => {
	describe("create", () => {
		it("throws ConflictException when slug is already taken", async () => {
			vi.mocked(wsRepo.findBySlug).mockResolvedValue(WorkspaceFactory.build({ slug: "taken" }));

			await expect(
				workspacesService.create({ name: "My WS", slug: "taken" }, "u1"),
			).rejects.toThrow(ConflictException);

			expect(wsRepo.create).not.toHaveBeenCalled();
		});

		it("creates workspace and root member in the correct order", async () => {
			const workspace = WorkspaceFactory.build({ slug: "new-ws" });
			vi.mocked(wsRepo.findBySlug).mockResolvedValue(null);
			vi.mocked(wsRepo.create).mockResolvedValue(workspace);
			vi.mocked(wmRepo.create).mockResolvedValue(
				WorkspaceMemberFactory.buildOwner({ workspaceId: workspace.id }),
			);

			const result = await workspacesService.create({ name: workspace.name, slug: "new-ws" }, "u1");

			expect(result).toBe(workspace);
			expect(wmRepo.create).toHaveBeenCalledWith(
				expect.objectContaining({
					workspaceId: workspace.id,
					userId: "u1",
					role: WorkspaceMemberRole.OWNER,
				}),
			);
		});

		it("root member is always created as OWNER regardless of input", async () => {
			const workspace = WorkspaceFactory.build();
			vi.mocked(wsRepo.findBySlug).mockResolvedValue(null);
			vi.mocked(wsRepo.create).mockResolvedValue(workspace);
			vi.mocked(wmRepo.create).mockResolvedValue(WorkspaceMemberFactory.build());

			await workspacesService.create({ name: "WS", slug: "slug" }, "u1");

			expect(wmRepo.create).toHaveBeenCalledWith(
				expect.objectContaining({ role: WorkspaceMemberRole.OWNER }),
			);
		});

		it("updates jobRole through real UsersService chain when provided", async () => {
			const user = UserFactory.build({ id: "u-with-role" });
			const workspace = WorkspaceFactory.build();
			vi.mocked(wsRepo.findBySlug).mockResolvedValue(null);
			vi.mocked(wsRepo.create).mockResolvedValue(workspace);
			vi.mocked(wmRepo.create).mockResolvedValue(WorkspaceMemberFactory.build());
			vi.mocked(usersRepo.update).mockResolvedValue(user);

			await workspacesService.create(
				{ name: "WS", slug: "slug", jobRole: "developer" as never },
				user.id,
			);

			expect(usersRepo.update).toHaveBeenCalledWith(user.id, { jobRole: "developer" });
		});

		it("does not call update when jobRole is not provided", async () => {
			const workspace = WorkspaceFactory.build();
			vi.mocked(wsRepo.findBySlug).mockResolvedValue(null);
			vi.mocked(wsRepo.create).mockResolvedValue(workspace);
			vi.mocked(wmRepo.create).mockResolvedValue(WorkspaceMemberFactory.build());

			await workspacesService.create({ name: "WS", slug: "slug" }, "u1");

			expect(usersRepo.update).not.toHaveBeenCalled();
		});
	});

	describe("findByUserId", () => {
		it("returns all workspaces for a user", async () => {
			const workspaces = WorkspaceFactory.buildList(3);
			vi.mocked(wsRepo.findByUserId).mockResolvedValue(workspaces);

			const result = await workspacesService.findByUserId("u1");

			expect(result).toBe(workspaces);
			expect(result).toHaveLength(3);
		});
	});
});
