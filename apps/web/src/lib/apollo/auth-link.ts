import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { ErrorLink } from "@apollo/client/link/error";
import { from, switchMap } from "rxjs";

import { ROUTES } from "@/constants/routes";
import { Refresh, SignOut } from "@/graphql/types";

const UNAUTHENTICATED = "UNAUTHENTICATED";

const PUBLIC_AUTH_OPERATIONS = new Set([
	"SignIn",
	"SignUp",
	"VerifyEmail",
	"ForgotPassword",
	"ResetPassword",
]);

let refreshPromise: Promise<boolean> | null = null;

async function attemptRefresh(uri: string): Promise<boolean> {
	const res = await fetch(uri, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify({ query: Refresh.loc?.source.body }),
	});

	const json = await res.json();
	return !json.errors;
}

async function signOutAndRedirect(uri: string): Promise<void> {
	try {
		await fetch(uri, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ query: SignOut.loc?.source.body }),
		});
	} catch {
		// best-effort
	}
	window.location.href = ROUTES.auth.login;
}

export function makeAuthLink(uri: string) {
	return new ErrorLink(({ error, operation, forward }) => {
		if (!CombinedGraphQLErrors.is(error)) return;

		if (operation.operationName && PUBLIC_AUTH_OPERATIONS.has(operation.operationName)) return;

		const isUnauthenticated = error.errors.some((e) => e.extensions?.["code"] === UNAUTHENTICATED);

		if (!isUnauthenticated) return;

		if (!refreshPromise) {
			refreshPromise = attemptRefresh(uri).finally(() => {
				refreshPromise = null;
			});
		}

		return from(refreshPromise).pipe(
			switchMap((success) => {
				if (!success) {
					signOutAndRedirect(uri);
					return new Promise(() => {}) as never;
				}
				return forward(operation);
			}),
		);
	});
}
