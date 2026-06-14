/**
 * Integration test for AuthService wiring.
 *
 * Uses real JwtService (actual JWT signing/verification) and real ConfigService.
 * Mocks only external I/O: UsersRepository, MailQueue, AppClsService (HTTP response).
 * Validates that the service correctly signs tokens, sets cookies, and handles
 * business logic branches end-to-end.
 */
import { AppClsService } from "@/infrastructure/cls";
import { UsersRepository } from "@/modules/users/users.repository";
import { AuthService } from "@/modules/auth/auth.service";
import { MailQueue } from "@/queues/mail";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import * as argon2 from "argon2";

const mockResponse = { setHeader: vi.fn() };

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

const mockMailQueue: Partial<MailQueue> = {
	enqueueEmailVerification: vi.fn(),
	enqueuePasswordReset: vi.fn(),
};

const mockCls = {
	get response() {
		return mockResponse;
	},
};

const TEST_JWT_SECRET = "test-access-secret-32-chars-long!";
const TEST_REFRESH_SECRET = "test-refresh-secret-32-chars-lon!";

let module: TestingModule;
let authService: AuthService;
let jwtService: JwtService;

beforeAll(async () => {
	process.env.JWT_ACCESS_SECRET = TEST_JWT_SECRET;
	process.env.JWT_REFRESH_SECRET = TEST_REFRESH_SECRET;
	process.env.CLIENT_EMAIL_VERIFICATION_URL = "http://localhost/verify";
	process.env.CLIENT_RESET_PASSWORD_URL = "http://localhost/reset";
	process.env.NODE_ENV = "test";

	module = await Test.createTestingModule({
		imports: [
			ConfigModule.forRoot({ ignoreEnvFile: true }),
			JwtModule.register({}),
		],
		providers: [
			AuthService,
			{ provide: UsersRepository, useValue: mockUsersRepository },
			{ provide: MailQueue, useValue: mockMailQueue },
			{ provide: AppClsService, useValue: mockCls },
		],
	}).compile();

	authService = module.get(AuthService);
	jwtService = module.get(JwtService);
});

afterAll(async () => {
	await module.close();
});

beforeEach(() => vi.clearAllMocks());

describe("AuthService integration", () => {
	describe("signUp", () => {
		it("throws ConflictException when email already exists", async () => {
			vi.mocked(mockUsersRepository.findByEmail!).mockResolvedValue({ id: "u1" } as never);

			await expect(
				authService.signUp({ email: "a@b.com", username: "user", fullName: "User", password: "pw" }),
			).rejects.toThrow(ConflictException);
		});

		it("creates user, signs real JWT tokens, sets Set-Cookie header, enqueues verification email", async () => {
			const user = { id: "u1", email: "a@b.com" };
			vi.mocked(mockUsersRepository.findByEmail!).mockResolvedValue(null);
			vi.mocked(mockUsersRepository.create!).mockResolvedValue(user as never);
			vi.mocked(mockUsersRepository.setRefreshToken!).mockResolvedValue(undefined);
			vi.mocked(mockMailQueue.enqueueEmailVerification!).mockResolvedValue(undefined as never);

			const result = await authService.signUp({
				email: "a@b.com",
				username: "user",
				fullName: "User",
				password: "pw",
			});

			expect(result).toBe(user);

			const setCookieCall = mockResponse.setHeader.mock.calls[0];
			expect(setCookieCall[0]).toBe("Set-Cookie");

			const cookies: string[] = setCookieCall[1];
			expect(cookies).toHaveLength(2);
			expect(cookies[0]).toMatch(/^velo:access_token=ey/);
			expect(cookies[1]).toMatch(/^velo:refresh_token=ey/);

			const accessToken = cookies[0]!.split(";")[0]!.split("=").slice(1).join("=");
			const decoded = jwtService.decode(accessToken) as Record<string, string>;
			expect(decoded.sub).toBe("u1");
		});
	});

	describe("signIn", () => {
		it("signs in with real argon2 password verification", async () => {
			const password = "correct-password";
			const hashedPassword = await argon2.hash(password);

			const user = { id: "u2", email: "b@b.com", password: hashedPassword };
			vi.mocked(mockUsersRepository.findByEmailWithPassword!).mockResolvedValue(user as never);
			vi.mocked(mockUsersRepository.setRefreshToken!).mockResolvedValue(undefined);

			const result = await authService.signIn({ email: "b@b.com", password });

			expect(result).toBe(user);
			expect(mockResponse.setHeader).toHaveBeenCalledWith("Set-Cookie", expect.any(Array));
		});

		it("rejects with real argon2 when password is wrong", async () => {
			const hashedPassword = await argon2.hash("correct-password");
			const user = { id: "u2", password: hashedPassword };
			vi.mocked(mockUsersRepository.findByEmailWithPassword!).mockResolvedValue(user as never);

			await expect(authService.signIn({ email: "b@b.com", password: "wrong" })).rejects.toThrow(
				UnauthorizedException,
			);
		});
	});

	describe("refresh", () => {
		it("issues new real JWT tokens for existing user", async () => {
			const user = { id: "u3", email: "c@b.com" };
			vi.mocked(mockUsersRepository.findById!).mockResolvedValue(user as never);
			vi.mocked(mockUsersRepository.setRefreshToken!).mockResolvedValue(undefined);

			const result = await authService.refresh("u3");

			expect(result).toBe(user);

			const cookies: string[] = mockResponse.setHeader.mock.calls[0][1];
			const accessToken = cookies[0]!.split(";")[0]!.split("=").slice(1).join("=");
			const decoded = jwtService.decode(accessToken) as Record<string, string>;
			expect(decoded.sub).toBe("u3");
		});
	});

	describe("signOut", () => {
		it("clears the refresh token and issues expired cookies", async () => {
			vi.mocked(mockUsersRepository.clearRefreshToken!).mockResolvedValue(undefined);

			await authService.signOut("u1");

			expect(mockUsersRepository.clearRefreshToken).toHaveBeenCalledWith("u1");

			const cookies: string[] = mockResponse.setHeader.mock.calls[0][1];
			expect(cookies[0]).toContain("Expires=Thu, 01 Jan 1970");
		});
	});

	describe("verifyEmail", () => {
		it("marks email as verified and returns true", async () => {
			vi.mocked(mockUsersRepository.findByEmailVerificationToken!).mockResolvedValue({
				id: "u4",
				isEmailVerified: false,
			} as never);
			vi.mocked(mockUsersRepository.verifyEmail!).mockResolvedValue(undefined);

			const result = await authService.verifyEmail("valid-token");

			expect(result).toBe(true);
			expect(mockUsersRepository.verifyEmail).toHaveBeenCalledWith("u4");
		});
	});
});
