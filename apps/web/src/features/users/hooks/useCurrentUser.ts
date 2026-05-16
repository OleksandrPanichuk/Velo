"use client";

import { useGetCurrentUserSuspenseQuery } from "@/graphql";

// Requires an authenticated session. Only use inside layouts protected by src/proxy.ts.
export function useCurrentUser() {
	const { data } = useGetCurrentUserSuspenseQuery();
	return data?.getCurrentUser ?? null;
}
