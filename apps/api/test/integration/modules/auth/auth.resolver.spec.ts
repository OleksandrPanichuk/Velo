/**
 * Integration test for AuthResolver.
 *
 * Uses real AuthService + real JwtService + real ConfigService.
 * Mocks only UsersRepository, MailQueue, and AppClsService (HTTP response/userId).
 * Tests beyond the unit layer:
 * - refresh() and signOut() read userId from the real CLS mock, not a hardcoded value
 * - Exceptions from the real service (UnauthorizedException, ConflictException) surface
 * - signOut() returns the boolean true, not void
 */
import { AppClsService } from "@/infrastructure/cls";
import { AuthResolver } from "@/modules/auth/auth.resolver";
import { AuthService } from "@/modules/auth/auth.service";
import { UsersRepository } from "@/modules/users/users.repository";
import { MailQueue } from "@/queues/mail";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { type TestingModule } from "@nestjs/testing";
import { UserFactory } from "../../../factories";
import { mockClsService, mockMailQueue, mockUsersRepository } from "../../../helpers/mocks";
import { TestModuleBuilder } from "../../../helpers/module.builder";

let module: TestingModule;
let resolver: AuthResolver;
let usersRepo: ReturnType<typeof mockUsersRepository>;
let mailQueue: ReturnType<typeof mockMailQueue>;
let clsMock: ReturnType<typeof mockClsService>;

beforeAll(async () => {
	usersRepo = mockUsersRepository();
	mailQueue = mockMailQueue();
	clsMock = mockClsService("cls-user-id");

	module = await new TestModuleBuilder()
		.withConfig()
		.withJwt()
		.addProviders([AuthResolver, AuthService])
		.overrideProvider(UsersRepository, usersRepo)
		.overrideProvider(MailQueue, mailQueue)
		.overrideProvider(AppClsService, clsMock)
		.compile();

	resolver = module.get(AuthResolver);
});

afterAll(async () => module.close());
beforeEach(() => vi.clearAllMocks());

describe("AuthResolver integration", () => {
	describe("signUp()", () => {
		it("creates user and returns it", async () => {
			const user = UserFactory.build();
			vi.mocked(usersRepo.findByEmail).mockResolvedValue(null);
			vi.mocked(usersRepo.create).mockResolvedValue(user);
			vi.mocked(usersRepo.setRefreshToken).mockResolvedValue(undefined);
			vi.mocked(mailQueue.enqueueEmailVerification).mockResolvedValue(undefined as never);

			const result = await resolver.signUp({
				email: user.email,
				username: user.username,
				fullName: user.fullName,
				password: "Password123!",
			});

			expect(result).toBe(user);
		});

		it("propagates ConflictException when email is already in use", async () => {
			vi.mocked(usersRepo.findByEmail).mockResolvedValue(UserFactory.build());

			await expect(
				resolver.signUp({ email: "taken@test.com", username: "u", fullName: "F", password: "pw" }),
			).rejects.toThrow(ConflictException);
		});
	});

	describe("signIn()", () => {
		it("propagates UnauthorizedException when credentials are invalid", async () => {
			vi.mocked(usersRepo.findByEmailWithPassword).mockResolvedValue(null);

			await expect(resolver.signIn({ email: "no@user.com", password: "wrong" })).rejects.toThrow(
				UnauthorizedException,
			);
		});
	});

	describe("refresh()", () => {
		it("reads userId from CLS and refreshes tokens", async () => {
			const user = UserFactory.buildVerified({ id: "cls-user-id" });
			vi.mocked(usersRepo.findById).mockResolvedValue(user);
			vi.mocked(usersRepo.setRefreshToken).mockResolvedValue(undefined);

			const result = await resolver.refresh();

			expect(usersRepo.findById).toHaveBeenCalledWith("cls-user-id");
			expect(result).toBe(user);
		});

		it("throws UnauthorizedException when CLS userId has no matching user", async () => {
			vi.mocked(usersRepo.findById).mockResolvedValue(null);

			await expect(resolver.refresh()).rejects.toThrow(UnauthorizedException);
		});
	});

	describe("signOut()", () => {
		it("clears the session and returns true", async () => {
			vi.mocked(usersRepo.clearRefreshToken).mockResolvedValue(undefined);

			const result = await resolver.signOut();

			expect(usersRepo.clearRefreshToken).toHaveBeenCalledWith("cls-user-id");
			expect(result).toBe(true);
		});
	});

	describe("verifyEmail()", () => {
		it("returns true on valid token", async () => {
			vi.mocked(usersRepo.findByEmailVerificationToken).mockResolvedValue(
				UserFactory.build({ isEmailVerified: false }),
			);
			vi.mocked(usersRepo.verifyEmail).mockResolvedValue(undefined);

			const result = await resolver.verifyEmail("valid-token");

			expect(result).toBe(true);
		});

		it("throws UnauthorizedException on invalid token", async () => {
			vi.mocked(usersRepo.findByEmailVerificationToken).mockResolvedValue(null);

			await expect(resolver.verifyEmail("bad-token")).rejects.toThrow(UnauthorizedException);
		});
	});

	describe("forgotPassword()", () => {
		it("returns true silently when email is not found", async () => {
			vi.mocked(usersRepo.findByEmail).mockResolvedValue(null);

			const result = await resolver.forgotPassword({ email: "ghost@test.com" });

			expect(result).toBe(true);
			expect(mailQueue.enqueuePasswordReset).not.toHaveBeenCalled();
		});

		it("enqueues reset email and returns true when user exists", async () => {
			const user = UserFactory.buildVerified();
			vi.mocked(usersRepo.findByEmail).mockResolvedValue(user);
			vi.mocked(usersRepo.setPasswordResetToken).mockResolvedValue(undefined);
			vi.mocked(mailQueue.enqueuePasswordReset).mockResolvedValue(undefined as never);

			const result = await resolver.forgotPassword({ email: user.email });

			expect(result).toBe(true);
			expect(mailQueue.enqueuePasswordReset).toHaveBeenCalledWith(
				user.email,
				expect.objectContaining({ expiresIn: "1 hour" }),
			);
		});
	});

	describe("resetPassword()", () => {
		it("returns true on valid unexpired token", async () => {
			const user = UserFactory.buildVerified();
			vi.mocked(usersRepo.findByPasswordResetToken).mockResolvedValue({
				...user,
				passwordResetTokenExpiresAt: new Date(Date.now() + 60_000),
			} as never);
			vi.mocked(usersRepo.updatePassword).mockResolvedValue(undefined);
			vi.mocked(usersRepo.clearPasswordResetToken).mockResolvedValue(undefined);

			const result = await resolver.resetPassword({ token: "valid", password: "NewPass123!" });

			expect(result).toBe(true);
		});
	});
});
