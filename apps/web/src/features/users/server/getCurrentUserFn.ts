import { cache } from "react";

import { GetCurrentUser, GetCurrentUserQuery } from "@/graphql/types";
import { query } from "@/lib/apollo";

import "server-only";

export const getCurrentUserFn = cache(async () => {
	const { data } = await query<GetCurrentUserQuery>({ query: GetCurrentUser });

	console.log("getCurrentUserFn", { data });
	return data?.getCurrentUser ?? null;
});
