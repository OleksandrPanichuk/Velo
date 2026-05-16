"use client";

import { useGetCurrentUserSuspenseQuery } from "@/graphql";

export function useCurrentUser() {
	const { data } = useGetCurrentUserSuspenseQuery();
	return data?.getCurrentUser ?? null;
}
