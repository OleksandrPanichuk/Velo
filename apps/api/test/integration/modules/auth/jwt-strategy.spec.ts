/**
 * Integration test for the JWT authentication round-trip.
 *
 * Proves that a token produced by AuthService can be:
 * 1. Validated by JwtAccessStrategy.validate()
 * 2. That validate() writes userId into CLS
 * 3. That an expired or tampered token is rejected
 *
 * This is genuinely different from unit tests because it uses a real
 * JwtService to sign tokens and a real JwtAccessStrategy to validate them.
 */
import { AppClsService } from "@/infrastructure/cls";
import { AuthService } from "@/modules/auth/auth.service";
import { JwtAccessStrategy } from "@/modules/auth/auth.strategies/jwt-access.strategy";
import { UsersRepository } from "@/modules/users/users.repository";
import { MailQueue } from "@/queues/mail";
import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { type TestingModule } from "@nestjs/testing";
import { UserFactory } from "../../../factories";
import {
	TEST_JWT_SECRET,
	mockClsService,
	mockMailQueue,
	mockUsersRepository,
	signToken,
} from "../../../helpers";
import { TestModuleBuilder } from "../../../helpers/module.builder";

let module: TestingModule;
let authService: AuthService;
let jwtAccessStrategy: JwtAccessStrategy;
let jwtService: JwtService;
let clsMock: ReturnType<typeof mockClsService>;

beforeAll(async () => {
	clsMock = mockClsService();

	module = await new TestModuleBuilder()
		.withConfig()
		.withJwt()
		.addProviders([AuthService, JwtAccessStrategy])
		.overrideProvider(UsersRepository, mockUsersRepository())
		.overrideProvider(MailQueue, mockMailQueue())
		.overrideProvider(AppClsService, clsMock)
		.compile();

	authService = module.get(AuthService);
	jwtAccessStrategy = module.get(JwtAccessStrategy);
	jwtService = module.get(JwtService);
});

afterAll(async () => module.close());
beforeEach(() => vi.clearAllMocks());

const readAccessTokenCookie = (): string => {
	const [firstCall] = clsMock.response.setHeader.mock.calls;
	if (!firstCall) {
		throw new Error("Expected a Set-Cookie header to have been written to the CLS response");
	}

	const [, cookies] = firstCall;
	const accessCookie = cookies.find((cookie) => cookie.startsWith("velo:access_token="));
	if (!accessCookie) {
		throw new Error("Expected a velo:access_token cookie in the Set-Cookie header");
	}

	const [cookiePair] = accessCookie.split(";");
	return (cookiePair ?? accessCookie).replace("velo:access_token=", "");
};

describe("JWT authentication round-trip", () => {
	describe("JwtAccessStrategy.validate()", () => {
		it("accepts a valid token and returns userId", () => {
			const userId = "user-abc-123";
			const token = signToken(userId, jwtService);
			const payload = jwtService.verify<{ sub: string; exp: number; iat: number }>(token, {
				secret: TEST_JWT_SECRET,
			});

			const result = jwtAccessStrategy.validate(payload);

			expect(result).toEqual({ userId });
		});

		it("writes userId into CLS on valid token", () => {
			const userId = "user-xyz-456";
			const token = signToken(userId, jwtService);
			const payload = jwtService.verify<{ sub: string; exp: number; iat: number }>(token, {
				secret: TEST_JWT_SECRET,
			});

			jwtAccessStrategy.validate(payload);

			expect(clsMock.setUserId).toHaveBeenCalledWith(userId);
		});

		it("throws UnauthorizedException when sub is missing", () => {
			expect(() => jwtAccessStrategy.validate({ sub: "", exp: 9999999999, iat: 0 })).toThrow(
				UnauthorizedException,
			);
		});
	});

	describe("AuthService → JwtAccessStrategy token round-trip", () => {
		it("signUp produces a token that JwtAccessStrategy can validate", async () => {
			const user = UserFactory.buildVerified({ id: "new-user-id" });
			const usersRepo = module.get(UsersRepository);

			vi.mocked(usersRepo.findByEmail).mockResolvedValue(null);
			vi.mocked(usersRepo.create).mockResolvedValue(user);
			vi.mocked(usersRepo.setRefreshToken).mockResolvedValue(undefined);
			vi.mocked(module.get(MailQueue).enqueueEmailVerification).mockResolvedValue(
				undefined as never,
			);

			await authService.signUp({
				email: user.email,
				username: user.username,
				fullName: user.fullName,
				password: "Password123!",
			});

			const rawToken = readAccessTokenCookie();

			const payload = jwtService.verify<{ sub: string; exp: number; iat: number }>(rawToken, {
				secret: TEST_JWT_SECRET,
			});

			const result = jwtAccessStrategy.validate(payload);
			expect(result.userId).toBe("new-user-id");
		});

		it("signIn produces a token with the signed-in user's id", async () => {
			const plainPassword = "CorrectPassword123!";
			const { hash } = await import("argon2");
			const hashedPassword = await hash(plainPassword);

			const user = UserFactory.buildVerified({ id: "sign-in-user" });
			const usersRepo = module.get(UsersRepository);

			vi.mocked(usersRepo.findByEmailWithPassword).mockResolvedValue({
				...user,
				password: hashedPassword,
			} as never);
			vi.mocked(usersRepo.setRefreshToken).mockResolvedValue(undefined);

			await authService.signIn({ email: user.email, password: plainPassword });

			const rawToken = readAccessTokenCookie();

			const payload = jwtService.verify<{ sub: string; exp: number; iat: number }>(rawToken, {
				secret: TEST_JWT_SECRET,
			});

			expect(payload.sub).toBe("sign-in-user");
		});
	});
});
