/**
 * Helpers for creating authenticated contexts in tests.
 *
 * auth.helper provides three things:
 * 1. signToken()  — raw JWT string for a given userId
 * 2. cookieHeader() — the HTTP Cookie header value an authenticated client would send
 * 3. authContext() — the GraphQL context object { req } that guards and decorators receive
 *
 * All helpers work with a real JwtService so tokens are cryptographically valid
 * and can be verified by JwtAccessStrategy in integration/e2e tests.
 */
import { CookieNames } from "@/constants";
import { JwtService } from "@nestjs/jwt";

export const TEST_JWT_SECRET = "test-access-secret-for-testing-only";
export const TEST_REFRESH_SECRET = "test-refresh-secret-for-testing-only";

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

export function signToken(
	userId: string,
	jwtService: JwtService,
	options: { secret?: string; expiresIn?: number } = {},
): string {
	const { secret = TEST_JWT_SECRET, expiresIn = 900 } = options;
	return jwtService.sign({ sub: userId }, { secret, expiresIn });
}

export function cookieHeader(accessToken: string): string {
	return `${CookieNames.ACCESS_TOKEN}=${accessToken}`;
}

export function authContext(accessToken: string): { req: { headers: { cookie: string } } } {
	return {
		req: {
			headers: {
				cookie: cookieHeader(accessToken),
			},
		},
	};
}

export function makeJwtService(): JwtService {
	return new JwtService({});
}
