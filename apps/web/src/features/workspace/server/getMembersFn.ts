import { cache } from "react";

import { GetMembers, GetMembersQuery, GetMembersQueryVariables } from "@/graphql/types";
import { query, workspaceContext } from "@/lib/apollo";

import "server-only";

export const getMembersFn = cache(async (workspaceId: string) => {
	const { data } = await query<GetMembersQuery, GetMembersQueryVariables>({
		query: GetMembers,
		variables: { workspaceId },
		context: workspaceContext(workspaceId),
	});

	return data?.members ?? [];
});
