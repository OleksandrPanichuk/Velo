import { CombinedGraphQLErrors } from "@apollo/client/errors";
import type { GraphQLFormattedError } from "graphql";

/**
 * Nest's Apollo driver only maps a few statuses to GraphQL error codes, so 404,
 * 409 and 410 all arrive as INTERNAL_SERVER_ERROR. AppExceptionFilter puts the
 * real status in extensions, which is the only reliable discriminator.
 */
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

	return undefined;
}

export function getGraphQLErrorStatus(error: unknown): number | undefined {
	if (!CombinedGraphQLErrors.is(error)) return undefined;

	for (const graphQLError of error.errors) {
		const status = readStatus(graphQLError);
		if (status !== undefined) return status;
	}

	return undefined;
}

export function hasGraphQLErrorCode(error: unknown, code: string): boolean {
	if (!CombinedGraphQLErrors.is(error)) return false;

	return error.errors.some((graphQLError) => graphQLError.extensions?.["code"] === code);
}
