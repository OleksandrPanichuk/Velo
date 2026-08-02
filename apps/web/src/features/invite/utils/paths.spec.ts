import { describe, expect, it } from "vitest";

import { ROUTES } from "@/constants";
import { acceptInvitePath, withInviteToken } from "@/features/invite/utils/paths";

describe("acceptInvitePath", () => {
	it("points at the invite route with the token as a query value", () => {
		expect(acceptInvitePath("plain-token")).toBe(`${ROUTES.auth.invite}?token=plain-token`);
	});

	it("encodes tokens so base64url padding cannot break the query string", () => {
		expect(acceptInvitePath("a+b/c=d&e")).toBe(`${ROUTES.auth.invite}?token=a%2Bb%2Fc%3Dd%26e`);
	});

	it("keeps injected input inside the query value instead of the path", () => {
		const path = acceptInvitePath("../../admin?x=1");

		expect(path.startsWith(`${ROUTES.auth.invite}?token=`)).toBe(true);
		expect(path).not.toContain("/admin");
	});
});

describe("withInviteToken", () => {
	it("returns the path untouched when there is no token", () => {
		expect(withInviteToken(ROUTES.auth.login, undefined)).toBe(ROUTES.auth.login);
		expect(withInviteToken(ROUTES.auth.register, "")).toBe(ROUTES.auth.register);
	});

	it("carries the token so it survives the trip through auth", () => {
		expect(withInviteToken(ROUTES.auth.register, "tok")).toBe(
			`${ROUTES.auth.register}?invite=tok`,
		);
	});

	it("encodes the token it appends", () => {
		expect(withInviteToken(ROUTES.auth.login, "a b&c")).toBe(
			`${ROUTES.auth.login}?invite=a%20b%26c`,
		);
	});
});
