"use client";

import { useGetCurrentUserQuery } from "@/graphql/hooks";

export function useCurrentUser() {
	const { data } = useGetCurrentUserQuery({ errorPolicy: "all" });
	return data?.getCurrentUser ?? null;
}
