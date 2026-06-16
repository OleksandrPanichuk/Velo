/**
 * Integration test for WorkspacesResolver.
 *
 * Uses real WorkspacesResolver + real WorkspacesService + real WorkspaceMembersService
 * + real UsersService wired together with mocked repositories.
 * Tests beyond the unit layer:
 * - createWorkspace goes through the full service chain (slug conflict check,
 *   workspace creation, root member setup)
 * - ConflictException from WorkspacesService surfaces through the resolver
 * - getWorkspacesByUserId returns the full list from the real service
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
import { UsersRepository } from "@/modules/users/users.repository";
import { UsersService } from "@/modules/users/users.service";
import { WorkspacesRepository } from "@/modules/workspaces/workspaces.repository";
import { WorkspacesResolver } from "@/modules/workspaces/workspaces.resolver";
import { WorkspacesService } from "@/modules/workspaces/workspaces.service";
import { PaginationService } from "@/shared/pagination";
import { ConflictException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { EventEmitter2 } from "@nestjs/event-emitter";
import {
	mockUsersRepository,
	mockWorkspaceMembersRepository,
	mockWorkspacesRepository,
} from "../../../helpers/mocks";
import { UserFactory, WorkspaceFactory, WorkspaceMemberFactory } from "../../../factories";

let module: TestingModule;
let resolver: WorkspacesResolver;
let wsRepo: ReturnType<typeof mockWorkspacesRepository>;
let wmRepo: ReturnType<typeof mockWorkspaceMembersRepository>;
let usersRepo: ReturnType<typeof mockUsersRepository>;

beforeAll(async () => {
	wsRepo = mockWorkspacesRepository();
	wmRepo = mockWorkspaceMembersRepository();
	usersRepo = mockUsersRepository();

	module = await Test.createTestingModule({
		providers: [
			WorkspacesResolver,
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

	resolver = module.get(WorkspacesResolver);
});

afterAll(() => module.close());
beforeEach(() => vi.clearAllMocks());

describe("WorkspacesResolver integration", () => {
	describe("getWorkspacesByUserId()", () => {
		it("returns workspaces for the given user through the real service", async () => {
			const user = UserFactory.buildVerified();
			const workspaces = WorkspaceFactory.buildList(3);
			vi.mocked(wsRepo.findByUserId).mockResolvedValue(workspaces);

			const result = await resolver.getWorkspacesByUserId(user.id);

			expect(result).toBe(workspaces);
			expect(wsRepo.findByUserId).toHaveBeenCalledWith(user.id);
		});

		it("returns empty array when user has no workspaces", async () => {
			vi.mocked(wsRepo.findByUserId).mockResolvedValue([]);

			const result = await resolver.getWorkspacesByUserId("u-no-workspaces");

			expect(result).toEqual([]);
		});
	});

	describe("createWorkspace()", () => {
		it("creates workspace and root member through the real service chain", async () => {
			const user = UserFactory.buildVerified();
			const workspace = WorkspaceFactory.build({ slug: "my-ws" });
			vi.mocked(wsRepo.findBySlug).mockResolvedValue(null);
			vi.mocked(wsRepo.create).mockResolvedValue(workspace);
			vi.mocked(wmRepo.create).mockResolvedValue(
				WorkspaceMemberFactory.buildOwner({ workspaceId: workspace.id, userId: user.id }),
			);

			const result = await resolver.createWorkspace(
				{ name: workspace.name, slug: "my-ws" },
				user.id,
			);

			expect(result).toBe(workspace);
			expect(wmRepo.create).toHaveBeenCalledWith(
				expect.objectContaining({
					workspaceId: workspace.id,
					userId: user.id,
					role: WorkspaceMemberRole.OWNER,
				}),
			);
		});

		it("propagates ConflictException when slug is taken", async () => {
			vi.mocked(wsRepo.findBySlug).mockResolvedValue(WorkspaceFactory.build({ slug: "taken" }));

			await expect(
				resolver.createWorkspace({ name: "New WS", slug: "taken" }, "u1"),
			).rejects.toThrow(ConflictException);

			expect(wsRepo.create).not.toHaveBeenCalled();
		});

		it("updates jobRole through the real UsersService when provided", async () => {
			const user = UserFactory.buildVerified();
			const workspace = WorkspaceFactory.build();
			vi.mocked(wsRepo.findBySlug).mockResolvedValue(null);
			vi.mocked(wsRepo.create).mockResolvedValue(workspace);
			vi.mocked(wmRepo.create).mockResolvedValue(WorkspaceMemberFactory.build());
			vi.mocked(usersRepo.update).mockResolvedValue(user);

			await resolver.createWorkspace(
				{ name: "WS", slug: "ws", jobRole: "developer" as never },
				user.id,
			);

			expect(usersRepo.update).toHaveBeenCalledWith(user.id, { jobRole: "developer" });
		});
	});
});
