/**
 * WorkspacesRepository + WorkspaceMembersRepository — real-DB integration tests.
 */
vi.mock("@nestjs-cls/transactional", () => ({
	Transactional: () => (_t: unknown, _k: string, d: PropertyDescriptor) => d,
	TransactionHost: class {},
	ClsPluginTransactional: class {
		constructor(_: unknown) {}
	},
}));
vi.mock("@nestjs-cls/transactional-adapter-typeorm", () => ({
	TransactionalAdapterTypeOrm: class {
		constructor(_: unknown) {}
	},
}));

import { TransactionHost } from "@nestjs-cls/transactional";
import { WorkspaceMemberRole } from "@/enums";
import { UserModel } from "@/models/User.model";
import { WorkspaceMemberModel } from "@/models/WorkspaceMember.model";
import { WorkspaceModel } from "@/models/Workspace.model";
import { WorkspaceMembersRepository } from "@/modules/workspace-members/workspace-members.repository";
import { WorkspacesRepository } from "@/modules/workspaces/workspaces.repository";
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import type { DataSource } from "typeorm";
import { createTestDataSource, getTestTypeOrmOptions, truncateAll } from "../../database/helpers";
import { SEED, seed } from "../../database/seeds";

let ds: DataSource;
let wsRepo: WorkspacesRepository;
let wmRepo: WorkspaceMembersRepository;

beforeAll(async () => {
	ds = createTestDataSource();
	await ds.initialize();

	const module = await Test.createTestingModule({
		imports: [
			TypeOrmModule.forRoot(getTestTypeOrmOptions()),
			TypeOrmModule.forFeature([WorkspaceModel, WorkspaceMemberModel, UserModel]),
		],
		providers: [
			WorkspacesRepository,
			WorkspaceMembersRepository,
			{ provide: TransactionHost, useValue: { tx: undefined } },
		],
	}).compile();

	wsRepo = module.get(WorkspacesRepository);
	wmRepo = module.get(WorkspaceMembersRepository);
});

afterAll(async () => ds.destroy());
beforeEach(async () => {
	await truncateAll(ds);
	await seed(ds); // seeds alice + bob + seed-workspace + alice as OWNER
});

describe("WorkspacesRepository (real DB)", () => {
	describe("findBySlug()", () => {
		it("returns the workspace for an existing slug", async () => {
			const result = await wsRepo.findBySlug(SEED.workspace.slug);

			expect(result).not.toBeNull();
			expect(result!.id).toBe(SEED.workspace.id);
			expect(result!.name).toBe(SEED.workspace.name);
		});

		it("returns null for an unknown slug", async () => {
			expect(await wsRepo.findBySlug("does-not-exist")).toBeNull();
		});
	});

	describe("findByUserId()", () => {
		it("returns workspaces the user is a member of", async () => {
			const result = await wsRepo.findByUserId(SEED.user.id);

			expect(result).toHaveLength(1);
			expect(result[0]?.id).toBe(SEED.workspace.id);
		});

		it("returns an empty array when the user has no memberships", async () => {
			// bob has no membership in the seed data
			const result = await wsRepo.findByUserId(SEED.secondUser.id);
			expect(result).toHaveLength(0);
		});
	});

	describe("create()", () => {
		it("inserts a new workspace and returns it with an id", async () => {
			const ws = await wsRepo.create({ name: "New WS", slug: "new-ws" });

			expect(ws.id).toBeDefined();
			expect(ws.slug).toBe("new-ws");

			const found = await wsRepo.findBySlug("new-ws");
			expect(found!.id).toBe(ws.id);
		});
	});

	describe("softDelete()", () => {
		it("hides the workspace from normal queries", async () => {
			await wsRepo.softDelete(SEED.workspace.id);
			const result = await wsRepo.findById(SEED.workspace.id);
			expect(result).toBeNull();
		});
	});
});

describe("WorkspaceMembersRepository (real DB)", () => {
	describe("findAdminsByWorkspaceId()", () => {
		it("returns OWNER and ADMIN members only", async () => {
			// Seed has alice as OWNER
			const admins = await wmRepo.findAdminsByWorkspaceId(SEED.workspace.id);

			expect(admins.length).toBeGreaterThanOrEqual(1);
			const roles = admins.map((m) => m.role);
			expect(roles).toContain(WorkspaceMemberRole.OWNER);
			for (const role of roles) {
				expect([WorkspaceMemberRole.OWNER, WorkspaceMemberRole.ADMIN]).toContain(role);
			}
		});

		it("excludes MEMBER role from results", async () => {
			// Add bob as a regular member
			await wmRepo.create({
				workspaceId: SEED.workspace.id,
				userId: SEED.secondUser.id,
				role: WorkspaceMemberRole.MEMBER,
			});

			const admins = await wmRepo.findAdminsByWorkspaceId(SEED.workspace.id);
			const bobEntry = admins.find((m) => m.userId === SEED.secondUser.id);
			expect(bobEntry).toBeUndefined();
		});

		it("returns an empty array for a workspace with no admins", async () => {
			const ws = await wsRepo.create({ name: "Empty WS", slug: "empty-ws" });
			const result = await wmRepo.findAdminsByWorkspaceId(ws.id);
			expect(result).toHaveLength(0);
		});
	});

	describe("create()", () => {
		it("creates a member and returns it with composite fields", async () => {
			const member = await wmRepo.create({
				workspaceId: SEED.workspace.id,
				userId: SEED.secondUser.id,
				role: WorkspaceMemberRole.ADMIN,
			});

			expect(member.id).toBeDefined();
			expect(member.role).toBe(WorkspaceMemberRole.ADMIN);
			expect(member.userId).toBe(SEED.secondUser.id);
		});
	});

	describe("findAll() / findById()", () => {
		it("findAll returns at least the seeded member", async () => {
			const all = await wmRepo.findAll();
			expect(all.length).toBeGreaterThanOrEqual(1);
		});

		it("findById returns the seeded membership", async () => {
			const [first] = await wmRepo.findAll();
			if (!first) {
				throw new Error("Expected the seeded workspace membership to exist");
			}

			const found = await wmRepo.findById(first.id);
			expect(found?.id).toBe(first.id);
		});
	});
});
