import { CombinedGraphQLErrors } from "@apollo/client/errors";
import type { GraphQLFormattedError } from "graphql";

export type AcceptInviteFailure =
	| "notFound"
	| "alreadyAccepted"
	| "expired"
	| "wrongEmail"
	| "unknown";

const HTTP_STATUS_TO_FAILURE: Record<number, AcceptInviteFailure> = {
	403: "wrongEmail",
	404: "notFound",
	409: "alreadyAccepted",
	410: "expired",
};

function readStatus(error: GraphQLFormattedError): number | undefined {
	const extensions = error.extensions;
	if (!extensions) return undefined;

	const status = extensions["status"];
	if (typeof status === "number") return status;

	const original = extensions["originalError"];
	if (original && typeof original === "object" && "statusCode" in original) {
		const statusCode = (original as { statusCode: unknown }).statusCode;
		if (typeof statusCode === "number") return statusCode;
	}

	if (extensions["code"] === "FORBIDDEN") return 403;

	return undefined;
}

export function classifyAcceptInviteError(error: unknown): AcceptInviteFailure {
	if (!CombinedGraphQLErrors.is(error)) return "unknown";

	for (const graphQLError of error.errors) {
		const status = readStatus(graphQLError);
		const failure = status === undefined ? undefined : HTTP_STATUS_TO_FAILURE[status];
		if (failure) return failure;
	}

	return "unknown";
}
