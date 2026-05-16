import "server-only";

import { cache } from "react";

import { GetCurrentUserDocument } from "@/graphql";
import { query } from "@/lib/apollo";

export const getCurrentUser = cache(async () => {
	const { data } = await query({ query: GetCurrentUserDocument });
	return data.getCurrentUser ?? null;
});
