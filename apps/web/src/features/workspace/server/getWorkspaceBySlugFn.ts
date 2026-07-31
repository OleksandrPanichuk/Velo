import { cache } from "react";

import {
	GetWorkspaceBySlug,
	GetWorkspaceBySlugQuery,
	GetWorkspaceBySlugQueryVariables,
} from "@/graphql/types";
import { query } from "@/lib/apollo";
import { getGraphQLErrorStatus } from "@/utils/graphqlError";

import "server-only";

const NOT_FOUND = 404;

export function isInaccessibleWorkspaceError(error: unknown) {
	return getGraphQLErrorStatus(error) === NOT_FOUND;
}

export const getWorkspaceBySlugFn = cache(async (slug: string) => {
	const { data, error } = await query<GetWorkspaceBySlugQuery, GetWorkspaceBySlugQueryVariables>({
		query: GetWorkspaceBySlug,
		variables: { slug },
		errorPolicy: "all",
	});

	if (error) {
		if (isInaccessibleWorkspaceError(error)) return null;
		throw error;
	}

	return data?.workspace ?? null;
});
