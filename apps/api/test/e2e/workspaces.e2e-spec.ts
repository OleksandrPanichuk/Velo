/**
 * Workspaces e2e tests.
 *
 * Tests the full HTTP → GraphQL → guard → service → response pipeline:
 * - createWorkspace requires auth (guard check)
 * - createWorkspace succeeds → returns workspace with id/name
 * - createWorkspace with duplicate slug → error (ConflictException)
 * - getWorkspacesByUserId returns array of workspaces
 */
vi.mock("@sentry/nestjs", () => ({ captureException: vi.fn() }));
vi.mock("@nestjs-cls/transactional", () => ({
	Transactional: () => (_target: unknown, _key: string, descriptor: PropertyDescriptor) =>
		descriptor,
	TransactionHost: class {},
	ClsPluginTransactional: class {
		constructor(_config: unknown) {}
	},
}));
vi.mock("@nestjs-cls/transactional-adapter-typeorm", () => ({
	TransactionalAdapterTypeOrm: class {
		constructor(_config: unknown) {}
	},
}));

import type { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import createWorkspaceMutation from "../graphql/workspaces/create-workspace.graphql";
import getWorkspacesByUserIdQuery from "../graphql/workspaces/get-workspaces-by-user-id.graphql";
import { UserFactory, WorkspaceFactory, WorkspaceMemberFactory } from "../factories";
import { signToken } from "../helpers/auth.helper";
import type { TestAppContext } from "./helpers/create-test-app";
import { createTestApp } from "./helpers/create-test-app";

let ctx: TestAppContext;
let app: INestApplication;

beforeAll(async () => {
	ctx = await createTestApp();
	app = ctx.app;
});

afterAll(async () => app.close());
beforeEach(() => vi.clearAllMocks());

// ─── Helpers ──────────────────────────────────────────────────────────────────

const authedGql = (token: string, query: string, variables?: Record<string, unknown>) =>
	request(app.getHttpServer())
		.post("/graphql")
		.set("Cookie", `velo:access_token=${token}`)
		.send({ query, variables });

const gql = (query: string, variables?: Record<string, unknown>) =>
	request(app.getHttpServer()).post("/graphql").send({ query, variables });

function makeToken(userId: string) {
	const jwtService = app.get(JwtService);
	return signToken(userId, jwtService);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Workspaces e2e", () => {
	describe("getWorkspacesByUserId query", () => {
		it("returns the user's workspaces", async () => {
			const user = UserFactory.buildVerified();
			const workspaces = WorkspaceFactory.buildList(2);
			const token = makeToken(user.id);

			vi.mocked(ctx.usersRepo.findById).mockResolvedValue(user);
			vi.mocked(ctx.wsRepo.findByUserId).mockResolvedValue(workspaces);

			const res = await authedGql(token, getWorkspacesByUserIdQuery);

			expect(res.status).toBe(200);
			expect(res.body.errors).toBeUndefined();
			expect(res.body.data.getWorkspacesByUserId).toHaveLength(2);
			expect(res.body.data.getWorkspacesByUserId[0].id).toBe(workspaces[0].id);
		});

		it("returns an empty array when the user has no workspaces", async () => {
			const user = UserFactory.buildVerified();
			const token = makeToken(user.id);

			vi.mocked(ctx.usersRepo.findById).mockResolvedValue(user);
			vi.mocked(ctx.wsRepo.findByUserId).mockResolvedValue([]);

			const res = await authedGql(token, getWorkspacesByUserIdQuery);

			expect(res.status).toBe(200);
			expect(res.body.errors).toBeUndefined();
			expect(res.body.data.getWorkspacesByUserId).toEqual([]);
		});
	});

	describe("createWorkspace mutation", () => {
		it("creates a workspace and returns it", async () => {
			const user = UserFactory.buildVerified();
			const workspace = WorkspaceFactory.build({ slug: "my-workspace" });
			const token = makeToken(user.id);

			vi.mocked(ctx.usersRepo.findById).mockResolvedValue(user);
			vi.mocked(ctx.wsRepo.findBySlug).mockResolvedValue(null);
			vi.mocked(ctx.wsRepo.create).mockResolvedValue(workspace);
			vi.mocked(ctx.wmRepo.create).mockResolvedValue(
				WorkspaceMemberFactory.buildOwner({ workspaceId: workspace.id, userId: user.id }),
			);

			const res = await authedGql(token, createWorkspaceMutation, {
				input: { name: workspace.name, slug: "my-workspace" },
			});

			expect(res.status).toBe(200);
			expect(res.body.errors).toBeUndefined();
			expect(res.body.data.createWorkspace.id).toBe(workspace.id);
			expect(res.body.data.createWorkspace.slug).toBe("my-workspace");
		});

		it("returns an error when slug is already taken", async () => {
			const user = UserFactory.buildVerified();
			const token = makeToken(user.id);

			vi.mocked(ctx.usersRepo.findById).mockResolvedValue(user);
			vi.mocked(ctx.wsRepo.findBySlug).mockResolvedValue(
				WorkspaceFactory.build({ slug: "taken-slug" }),
			);

			const res = await authedGql(token, createWorkspaceMutation, {
				input: { name: "My WS", slug: "taken-slug" },
			});

			// ConflictException (409) has no dedicated Apollo code so it surfaces as INTERNAL_SERVER_ERROR
			expect(res.status).toBe(200);
			expect(res.body.errors).toBeDefined();
			expect(res.body.data).toBeNull();
			expect(ctx.wsRepo.create).not.toHaveBeenCalled();
		});

		it("returns UNAUTHENTICATED when called without auth cookie", async () => {
			const res = await gql(createWorkspaceMutation, {
				input: { name: "WS", slug: "ws" },
			});

			expect(res.status).toBe(200);
			expect(res.body.errors).toBeDefined();
			expect(res.body.errors[0].extensions.code).toBe("UNAUTHENTICATED");
		});
	});
});
