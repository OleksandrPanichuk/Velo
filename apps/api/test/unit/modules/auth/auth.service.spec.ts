import { type AppClsService } from "@/infrastructure/cls";
import { type UsersRepository } from "@/modules/users/users.repository";
import { type MailQueue } from "@/queues/mail";
import { BadRequestException, ConflictException, UnauthorizedException } from "@nestjs/common";
import { type JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { AuthService } from "@/modules/auth/auth.service";

vi.mock("argon2", () => ({ verify: vi.fn(), hash: vi.fn() }));

const mockUsersRepository: Partial<UsersRepository> = {
	findByEmail: vi.fn(),
	findByEmailWithPassword: vi.fn(),
	findByEmailVerificationToken: vi.fn(),
	findByPasswordResetToken: vi.fn(),
	findById: vi.fn(),
	findOAuthAccount: vi.fn(),
	create: vi.fn(),
	setRefreshToken: vi.fn(),
	clearRefreshToken: vi.fn(),
	verifyEmail: vi.fn(),
	setPasswordResetToken: vi.fn(),
	clearPasswordResetToken: vi.fn(),
	updatePassword: vi.fn(),
	linkOAuthAccount: vi.fn(),
	createUserWithOAuth: vi.fn(),
};

const mockJwtService: Partial<JwtService> = {
	signAsync: vi.fn(),
};

const mockResponse = { setHeader: vi.fn() };

const mockCls: Partial<AppClsService> = {
	get response() {
		return mockResponse as never;
	},
};

const mockMailQueue: Partial<MailQueue> = {
	enqueueEmailVerification: vi.fn(),
	enqueuePasswordReset: vi.fn(),
};

const configValues: Record<string, unknown> = {
	JWT_ACCESS_SECRET: "access-secret",
	JWT_REFRESH_SECRET: "refresh-secret",
	NODE_ENV: "test",
	CLIENT_EMAIL_VERIFICATION_URL: "http://localhost/verify",
	CLIENT_RESET_PASSWORD_URL: "http://localhost/reset",
};

const mockConfig = {
	getOrThrow: vi.fn((key: string) => configValues[key]),
	get: vi.fn((key: string) => configValues[key]),
};

const buildService = () =>
	new AuthService(
		mockJwtService as JwtService,
		mockConfig as never,
		mockUsersRepository as UsersRepository,
		mockMailQueue as MailQueue,
		mockCls as AppClsService,
	);

describe("AuthService", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(mockJwtService.signAsync!).mockResolvedValue("signed-token");
	});

	describe("signUp", () => {
		it("throws ConflictException if email is already in use", async () => {
			vi.mocked(mockUsersRepository.findByEmail!).mockResolvedValue({ id: "u1" } as never);

			await expect(
				buildService().signUp({
					email: "a@b.com",
					username: "user",
					fullName: "User",
					password: "pw",
				}),
			).rejects.toThrow(ConflictException);
		});

		it("creates user, sets cookies, enqueues verification email and returns user", async () => {
			const user = { id: "u1", email: "a@b.com" };
			vi.mocked(mockUsersRepository.findByEmail!).mockResolvedValue(null);
			vi.mocked(mockUsersRepository.create!).mockResolvedValue(user as never);
			vi.mocked(mockUsersRepository.setRefreshToken!).mockResolvedValue(undefined);
			vi.mocked(mockMailQueue.enqueueEmailVerification!).mockResolvedValue(undefined as never);

			const result = await buildService().signUp({
				email: "a@b.com",
				username: "user",
				fullName: "User",
				password: "pw",
			});

			expect(mockUsersRepository.create).toHaveBeenCalledWith(
				expect.objectContaining({ email: "a@b.com", username: "user" }),
			);
			expect(mockUsersRepository.setRefreshToken).toHaveBeenCalledWith("u1", "signed-token");
			expect(mockResponse.setHeader).toHaveBeenCalledWith("Set-Cookie", expect.any(Array));
			expect(mockMailQueue.enqueueEmailVerification).toHaveBeenCalledWith(
				"a@b.com",
				expect.objectContaining({ expiresIn: "7 days" }),
			);
			expect(result).toBe(user);
		});
	});

	describe("signIn", () => {
		it("throws UnauthorizedException if user not found", async () => {
			vi.mocked(mockUsersRepository.findByEmailWithPassword!).mockResolvedValue(null);

			await expect(buildService().signIn({ email: "a@b.com", password: "pw" })).rejects.toThrow(
				UnauthorizedException,
			);
		});

		it("throws UnauthorizedException if user has no password (oauth account)", async () => {
			vi.mocked(mockUsersRepository.findByEmailWithPassword!).mockResolvedValue({
				id: "u1",
				password: null,
			} as never);

			await expect(buildService().signIn({ email: "a@b.com", password: "pw" })).rejects.toThrow(
				UnauthorizedException,
			);
		});

		it("throws UnauthorizedException if password is invalid", async () => {
			vi.mocked(mockUsersRepository.findByEmailWithPassword!).mockResolvedValue({
				id: "u1",
				password: "hashed",
			} as never);
			vi.mocked(argon2.verify).mockResolvedValue(false);

			await expect(buildService().signIn({ email: "a@b.com", password: "wrong" })).rejects.toThrow(
				UnauthorizedException,
			);
		});

		it("sets cookies and returns user on valid credentials", async () => {
			const user = { id: "u1", email: "a@b.com", password: "hashed" };
			vi.mocked(mockUsersRepository.findByEmailWithPassword!).mockResolvedValue(user as never);
			vi.mocked(argon2.verify).mockResolvedValue(true);
			vi.mocked(mockUsersRepository.setRefreshToken!).mockResolvedValue(undefined);

			const result = await buildService().signIn({ email: "a@b.com", password: "correct" });

			expect(mockUsersRepository.setRefreshToken).toHaveBeenCalled();
			expect(mockResponse.setHeader).toHaveBeenCalledWith("Set-Cookie", expect.any(Array));
			expect(result).toBe(user);
		});
	});

	describe("refresh", () => {
		it("throws UnauthorizedException if user not found", async () => {
			vi.mocked(mockUsersRepository.findById!).mockResolvedValue(null);

			await expect(buildService().refresh("user-id")).rejects.toThrow(UnauthorizedException);
		});

		it("generates new tokens, sets cookies and returns user", async () => {
			const user = { id: "u1" };
			vi.mocked(mockUsersRepository.findById!).mockResolvedValue(user as never);
			vi.mocked(mockUsersRepository.setRefreshToken!).mockResolvedValue(undefined);

			const result = await buildService().refresh("u1");

			expect(mockUsersRepository.setRefreshToken).toHaveBeenCalledWith("u1", "signed-token");
			expect(mockResponse.setHeader).toHaveBeenCalledWith("Set-Cookie", expect.any(Array));
			expect(result).toBe(user);
		});
	});

	describe("signOut", () => {
		it("clears refresh token and sets expired cookies", async () => {
			vi.mocked(mockUsersRepository.clearRefreshToken!).mockResolvedValue(undefined);

			await buildService().signOut("u1");

			expect(mockUsersRepository.clearRefreshToken).toHaveBeenCalledWith("u1");
			expect(mockResponse.setHeader).toHaveBeenCalledWith(
				"Set-Cookie",
				expect.arrayContaining([
					expect.stringContaining("velo:access_token=;"),
					expect.stringContaining("velo:refresh_token=;"),
				]),
			);
		});
	});

	describe("verifyEmail", () => {
		it("throws UnauthorizedException if token is invalid", async () => {
			vi.mocked(mockUsersRepository.findByEmailVerificationToken!).mockResolvedValue(null);

			await expect(buildService().verifyEmail("bad-token")).rejects.toThrow(UnauthorizedException);
		});

		it("throws ConflictException if email is already verified", async () => {
			vi.mocked(mockUsersRepository.findByEmailVerificationToken!).mockResolvedValue({
				id: "u1",
				isEmailVerified: true,
			} as never);

			await expect(buildService().verifyEmail("token")).rejects.toThrow(ConflictException);
		});

		it("verifies email and returns true", async () => {
			vi.mocked(mockUsersRepository.findByEmailVerificationToken!).mockResolvedValue({
				id: "u1",
				isEmailVerified: false,
			} as never);
			vi.mocked(mockUsersRepository.verifyEmail!).mockResolvedValue(undefined);

			const result = await buildService().verifyEmail("valid-token");

			expect(mockUsersRepository.verifyEmail).toHaveBeenCalledWith("u1");
			expect(result).toBe(true);
		});
	});

	describe("forgotPassword", () => {
		it("returns true silently if user does not exist", async () => {
			vi.mocked(mockUsersRepository.findByEmail!).mockResolvedValue(null);

			const result = await buildService().forgotPassword({ email: "unknown@b.com" });

			expect(result).toBe(true);
			expect(mockMailQueue.enqueuePasswordReset).not.toHaveBeenCalled();
		});

		it("sets reset token and enqueues email when user exists", async () => {
			const user = { id: "u1", email: "a@b.com" };
			vi.mocked(mockUsersRepository.findByEmail!).mockResolvedValue(user as never);
			vi.mocked(mockUsersRepository.setPasswordResetToken!).mockResolvedValue(undefined);
			vi.mocked(mockMailQueue.enqueuePasswordReset!).mockResolvedValue(undefined as never);

			const result = await buildService().forgotPassword({ email: "a@b.com" });

			expect(mockUsersRepository.setPasswordResetToken).toHaveBeenCalledWith(
				"u1",
				expect.any(String),
				expect.any(Date),
			);
			expect(mockMailQueue.enqueuePasswordReset).toHaveBeenCalledWith(
				"a@b.com",
				expect.objectContaining({ expiresIn: "1 hour" }),
			);
			expect(result).toBe(true);
		});
	});

	describe("resetPassword", () => {
		it("throws BadRequestException if token is invalid", async () => {
			vi.mocked(mockUsersRepository.findByPasswordResetToken!).mockResolvedValue(null);

			await expect(
				buildService().resetPassword({ token: "bad", password: "newpw" }),
			).rejects.toThrow(BadRequestException);
		});

		it("throws BadRequestException if token is expired", async () => {
			vi.mocked(mockUsersRepository.findByPasswordResetToken!).mockResolvedValue({
				id: "u1",
				passwordResetTokenExpiresAt: new Date(Date.now() - 1000),
			} as never);

			await expect(
				buildService().resetPassword({ token: "expired", password: "newpw" }),
			).rejects.toThrow(BadRequestException);
		});

		it("throws BadRequestException if expiresAt is missing", async () => {
			vi.mocked(mockUsersRepository.findByPasswordResetToken!).mockResolvedValue({
				id: "u1",
				passwordResetTokenExpiresAt: null,
			} as never);

			await expect(
				buildService().resetPassword({ token: "noexpiry", password: "newpw" }),
			).rejects.toThrow(BadRequestException);
		});

		it("updates password, clears token and returns true", async () => {
			const future = new Date(Date.now() + 60_000);
			vi.mocked(mockUsersRepository.findByPasswordResetToken!).mockResolvedValue({
				id: "u1",
				passwordResetTokenExpiresAt: future,
			} as never);
			vi.mocked(mockUsersRepository.updatePassword!).mockResolvedValue(undefined);
			vi.mocked(mockUsersRepository.clearPasswordResetToken!).mockResolvedValue(undefined);

			const result = await buildService().resetPassword({ token: "valid", password: "newpw" });

			expect(mockUsersRepository.updatePassword).toHaveBeenCalledWith("u1", "newpw");
			expect(mockUsersRepository.clearPasswordResetToken).toHaveBeenCalledWith("u1");
			expect(result).toBe(true);
		});
	});

	describe("oauthSignIn", () => {
		const oauthData = {
			provider: "google" as never,
			providerId: "gid-1",
			email: "a@b.com",
			fullName: "User",
			accessToken: "oauth-token",
		};

		it("uses existing oauth account when found", async () => {
			const user = { id: "u1" };
			vi.mocked(mockUsersRepository.findOAuthAccount!).mockResolvedValue({
				user,
			} as never);
			vi.mocked(mockUsersRepository.setRefreshToken!).mockResolvedValue(undefined);

			const result = await buildService().oauthSignIn(oauthData);

			expect(mockUsersRepository.findOAuthAccount).toHaveBeenCalledWith("google", "gid-1");
			expect(result).toBe(user);
		});

		it("links oauth account to existing user with same email", async () => {
			const user = { id: "u1" };
			vi.mocked(mockUsersRepository.findOAuthAccount!).mockResolvedValue(null);
			vi.mocked(mockUsersRepository.findByEmail!).mockResolvedValue(user as never);
			vi.mocked(mockUsersRepository.linkOAuthAccount!).mockResolvedValue({} as never);
			vi.mocked(mockUsersRepository.setRefreshToken!).mockResolvedValue(undefined);

			const result = await buildService().oauthSignIn(oauthData);

			expect(mockUsersRepository.linkOAuthAccount).toHaveBeenCalledWith("u1", oauthData);
			expect(result).toBe(user);
		});

		it("creates a new user with oauth when no existing account or email match", async () => {
			const newUser = { id: "u2" };
			vi.mocked(mockUsersRepository.findOAuthAccount!).mockResolvedValue(null);
			vi.mocked(mockUsersRepository.findByEmail!).mockResolvedValue(null);
			vi.mocked(mockUsersRepository.createUserWithOAuth!).mockResolvedValue(newUser as never);
			vi.mocked(mockUsersRepository.setRefreshToken!).mockResolvedValue(undefined);

			const result = await buildService().oauthSignIn(oauthData);

			expect(mockUsersRepository.createUserWithOAuth).toHaveBeenCalledWith(oauthData);
			expect(result).toBe(newUser);
		});

		it("sets cookies for all oauth sign-in paths", async () => {
			const user = { id: "u1" };
			vi.mocked(mockUsersRepository.findOAuthAccount!).mockResolvedValue({ user } as never);
			vi.mocked(mockUsersRepository.setRefreshToken!).mockResolvedValue(undefined);

			await buildService().oauthSignIn(oauthData);

			expect(mockResponse.setHeader).toHaveBeenCalledWith("Set-Cookie", expect.any(Array));
		});
	});
});
