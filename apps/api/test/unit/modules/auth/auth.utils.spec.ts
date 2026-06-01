import { type Request } from "express";
import { CookieNames } from "@/constants";
import { extractFromCookie } from "@/modules/auth/auth.utils";

const makeRequest = (cookies?: Record<string, string | undefined>): Request =>
	({
		cookies,
	}) as unknown as Request;

describe("extractFromCookies", () => {
	it("returns the cookie value when it exists", () => {
		const req = makeRequest({ [CookieNames.ACCESS_TOKEN]: "abc123" });

		const result = extractFromCookie(CookieNames.ACCESS_TOKEN)(req);

		expect(result).toBe("abc123");
	});

	it("returns null when the cookie is missing", () => {
		const req = makeRequest({ [CookieNames.REFRESH_TOKEN]: "xyz" });

		const result = extractFromCookie(CookieNames.ACCESS_TOKEN)(req);

		expect(result).toBeNull();
	});

	it("returns null when cookies object is undefined", () => {
		const req = makeRequest(undefined);

		const result = extractFromCookie(CookieNames.ACCESS_TOKEN)(req);

		expect(result).toBeNull();
	});

	it("returns null when the cookie value is undefined", () => {
		const req = makeRequest({ [CookieNames.ACCESS_TOKEN]: undefined });

		const result = extractFromCookie(CookieNames.ACCESS_TOKEN)(req);

		expect(result).toBeNull();
	});

	it("returns a curried extractor that targets the specified cookie name", () => {
		const req = makeRequest({
			[CookieNames.ACCESS_TOKEN]: "access",
			[CookieNames.REFRESH_TOKEN]: "refresh",
		});

		expect(extractFromCookie(CookieNames.ACCESS_TOKEN)(req)).toBe("access");
		expect(extractFromCookie(CookieNames.REFRESH_TOKEN)(req)).toBe("refresh");
	});
});
