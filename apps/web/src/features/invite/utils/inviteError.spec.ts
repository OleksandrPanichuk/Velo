import { CombinedGraphQLErrors } from "@apollo/client/errors";
import type { GraphQLFormattedError } from "graphql";
import { describe, expect, it } from "vitest";

import { classifyAcceptInviteError } from "@/features/invite/utils/inviteError";

function apiError(extensions: GraphQLFormattedError["extensions"], message = "boom") {
	return new CombinedGraphQLErrors({ errors: [{ message, extensions }] });
}

/**
 * The API returns distinct statuses, but Nest's Apollo driver leaves the code as
 * INTERNAL_SERVER_ERROR for 404/409/410 — so `status` is the only discriminator.
 * These payloads mirror what the running API actually sends.
 */
describe("classifyAcceptInviteError", () => {
	it.each([
		[404, "notFound"],
		[409, "alreadyAccepted"],
		[410, "expired"],
		[403, "wrongEmail"],
	] as const)("maps status %i to %s", (status, expected) => {
		const error = apiError({ code: "INTERNAL_SERVER_ERROR", status });

		expect(classifyAcceptInviteError(error)).toBe(expected);
	});

	it("falls back to originalError.statusCode when status is absent", () => {
		const error = apiError({
			code: "INTERNAL_SERVER_ERROR",
			originalError: { statusCode: 410, message: "This invite has expired" },
		});

		expect(classifyAcceptInviteError(error)).toBe("expired");
	});

	it("does not trust the misleading code when a status is present", () => {
		const error = apiError({ code: "INTERNAL_SERVER_ERROR", status: 404 });

		expect(classifyAcceptInviteError(error)).not.toBe("unknown");
	});

	it("treats a bare FORBIDDEN code as a wrong-email failure", () => {
		expect(classifyAcceptInviteError(apiError({ code: "FORBIDDEN" }))).toBe("wrongEmail");
	});

	it("returns unknown for an expired session rather than guessing", () => {
		expect(classifyAcceptInviteError(apiError({ code: "UNAUTHENTICATED" }))).toBe("unknown");
	});

	it("returns unknown for a status the UI has no message for", () => {
		expect(classifyAcceptInviteError(apiError({ status: 500 }))).toBe("unknown");
	});

	it("returns unknown for errors with no extensions at all", () => {
		expect(classifyAcceptInviteError(apiError(undefined))).toBe("unknown");
	});

	it("returns unknown for a network error, so it cannot claim the wrong reason", () => {
		expect(classifyAcceptInviteError(new Error("Failed to fetch"))).toBe("unknown");
		expect(classifyAcceptInviteError(undefined)).toBe("unknown");
	});

	it("uses the first error that carries a recognised status", () => {
		const error = new CombinedGraphQLErrors({
			errors: [
				{ message: "unrelated", extensions: { code: "UNAUTHENTICATED" } },
				{ message: "gone", extensions: { status: 410 } },
			],
		});

		expect(classifyAcceptInviteError(error)).toBe("expired");
	});
});
