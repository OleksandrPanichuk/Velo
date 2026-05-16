import { cache } from "react";

import { GetCurrentUserDocument, GetCurrentUserQuery } from "@/graphql";
import { query } from "@/lib/apollo";

import "server-only";

export const getCurrentUser = cache(async () => {
	const { data } = await query<GetCurrentUserQuery>({ query: GetCurrentUserDocument });
	return data?.getCurrentUser ?? null;
});
