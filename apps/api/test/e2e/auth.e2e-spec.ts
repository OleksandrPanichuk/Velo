/**
 * Auth e2e tests.
 *
 * Tests the full HTTP → GraphQL → guard → service → response pipeline:
 * - signUp mutation sets HttpOnly cookies in the response
 * - signIn with wrong credentials → UNAUTHENTICATED error
 * - Protected query without token → UNAUTHENTICATED error (guard blocks)
 * - getCurrentUser with valid cookie → returns user
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
import { UserFactory } from "../factories";
import signInMutation from "../graphql/auth/sign-in.graphql";
import signUpMutation from "../graphql/auth/sign-up.graphql";
import verifyEmailMutation from "../graphql/auth/verify-email.graphql";
import getCurrentUserQuery from "../graphql/users/get-current-user.graphql";
import getWorkspacesQuery from "../graphql/workspaces/get-workspaces.graphql";
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

const gql = (query: string, variables?: Record<string, unknown>) =>
	request(app.getHttpServer()).post("/graphql").send({ query, variables });

const authedGql = (token: string, query: string, variables?: Record<string, unknown>) =>
	request(app.getHttpServer())
		.post("/graphql")
		.set("Cookie", `velo:access_token=${token}`)
		.send({ query, variables });

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Auth e2e", () => {
	describe("signUp mutation", () => {
		it("creates user and sets access + refresh token cookies", async () => {
			const user = UserFactory.build();
			vi.mocked(ctx.usersRepo.findByEmail).mockResolvedValue(null);
			vi.mocked(ctx.usersRepo.create).mockResolvedValue(user);
			vi.mocked(ctx.usersRepo.setRefreshToken).mockResolvedValue(undefined);
			vi.mocked(ctx.mailQueue.enqueueEmailVerification).mockResolvedValue(undefined as never);

			const res = await gql(signUpMutation, {
				input: {
					email: user.email,
					username: user.username,
					fullName: user.fullName,
					password: "Password123!",
				},
			});

			expect(res.status).toBe(200);
			expect(res.body.errors).toBeUndefined();
			expect(res.body.data.signUp.id).toBe(user.id);

			const cookies: string | string[] | undefined = res.headers["set-cookie"];
			expect(cookies).toBeDefined();
			const cookieStr = Array.isArray(cookies) ? cookies.join("; ") : (cookies ?? "");
			expect(cookieStr).toMatch(/velo:access_token=/);
			expect(cookieStr).toMatch(/velo:refresh_token=/);
		});

		it("returns an error when email is already taken", async () => {
			vi.mocked(ctx.usersRepo.findByEmail).mockResolvedValue(UserFactory.build());

			const res = await gql(signUpMutation, {
				input: {
					email: "taken@test.com",
					username: "testuser",
					fullName: "Test User",
					password: "Password123!",
				},
			});

			// ConflictException (409) has no dedicated Apollo code so it surfaces as INTERNAL_SERVER_ERROR
			expect(res.status).toBe(200);
			expect(res.body.errors).toBeDefined();
			expect(res.body.data).toBeNull();
		});
	});

	describe("signIn mutation", () => {
		it("returns UNAUTHENTICATED when credentials are wrong", async () => {
			vi.mocked(ctx.usersRepo.findByEmailWithPassword).mockResolvedValue(null);

			const res = await gql(signInMutation, {
				input: { email: "no@user.com", password: "wrong" },
			});

			expect(res.status).toBe(200);
			expect(res.body.errors).toBeDefined();
			expect(res.body.errors[0].extensions.code).toBe("UNAUTHENTICATED");
		});
	});

	describe("getCurrentUser query", () => {
		it("returns null when no auth cookie is present (public query)", async () => {
			const res = await gql(getCurrentUserQuery);

			expect(res.status).toBe(200);
			expect(res.body.errors).toBeUndefined();
			expect(res.body.data.getCurrentUser).toBeNull();
		});

		it("returns the authenticated user when a valid access token cookie is provided", async () => {
			const user = UserFactory.buildVerified();
			const jwtService = app.get(JwtService);
			const token = signToken(user.id, jwtService);

			vi.mocked(ctx.usersRepo.findById).mockResolvedValue(user);

			const res = await authedGql(token, getCurrentUserQuery);

			expect(res.status).toBe(200);
			expect(res.body.errors).toBeUndefined();
			expect(res.body.data.getCurrentUser.id).toBe(user.id);
		});
	});

	describe("protected query (AppAuthGuard)", () => {
		it("returns UNAUTHENTICATED when accessing protected query without token", async () => {
			const res = await gql(getWorkspacesQuery);

			expect(res.status).toBe(200);
			expect(res.body.errors).toBeDefined();
			expect(res.body.errors[0].extensions.code).toBe("UNAUTHENTICATED");
		});

		it("allows access to protected query with valid access token", async () => {
			const user = UserFactory.buildVerified();
			const jwtService = app.get(JwtService);
			const token = signToken(user.id, jwtService);

			vi.mocked(ctx.wsRepo.findByUserId).mockResolvedValue([]);
			vi.mocked(ctx.usersRepo.findById).mockResolvedValue(user);

			const res = await authedGql(token, getWorkspacesQuery);

			expect(res.status).toBe(200);
			expect(res.body.errors).toBeUndefined();
			expect(res.body.data.getWorkspaces).toEqual([]);
		});
	});

	describe("verifyEmail mutation", () => {
		it("returns true for a valid token", async () => {
			vi.mocked(ctx.usersRepo.findByEmailVerificationToken).mockResolvedValue(
				UserFactory.build({ isEmailVerified: false }),
			);
			vi.mocked(ctx.usersRepo.verifyEmail).mockResolvedValue(undefined);

			const res = await gql(verifyEmailMutation, { token: "valid-token" });

			expect(res.status).toBe(200);
			expect(res.body.errors).toBeUndefined();
			expect(res.body.data.verifyEmail).toBe(true);
		});

		it("returns UNAUTHENTICATED for an invalid token", async () => {
			vi.mocked(ctx.usersRepo.findByEmailVerificationToken).mockResolvedValue(null);

			const res = await gql(verifyEmailMutation, { token: "bad-token" });

			expect(res.status).toBe(200);
			expect(res.body.errors).toBeDefined();
			expect(res.body.errors[0].extensions.code).toBe("UNAUTHENTICATED");
		});
	});
});
