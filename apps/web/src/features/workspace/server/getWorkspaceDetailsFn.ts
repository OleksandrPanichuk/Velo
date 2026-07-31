import { cache } from "react";

import {
	GetWorkspaceDetails,
	GetWorkspaceDetailsQuery,
	GetWorkspaceDetailsQueryVariables,
} from "@/graphql/types";
import { query } from "@/lib/apollo";

import { isInaccessibleWorkspaceError } from "./getWorkspaceBySlugFn";

import "server-only";

export const getWorkspaceDetailsFn = cache(async (slug: string) => {
	const { data, error } = await query<
		GetWorkspaceDetailsQuery,
		GetWorkspaceDetailsQueryVariables
	>({
		query: GetWorkspaceDetails,
		variables: { slug },
		errorPolicy: "all",
	});

	if (error) {
		if (isInaccessibleWorkspaceError(error)) return null;
		throw error;
	}

	return data?.workspace ?? null;
});
