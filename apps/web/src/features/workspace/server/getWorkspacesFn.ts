import { cache } from "react";

import { GetWorkspaces, GetWorkspacesQuery } from "@/graphql/types";
import { query } from "@/lib/apollo";

import "server-only";

export const getWorkspacesFn = cache(async () => {
	const { data, error } = await query<GetWorkspacesQuery>({ query: GetWorkspaces });

	return data?.getWorkspacesByUserId ?? [];
});
