import { ApolloLink, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

import { env } from "@/lib/env";

import { makeAuthLink } from "./auth-link";

function getServerUri() {
	return `${process.env.API_URL || "http://api:8080"}/graphql`;
}

function getClientUri() {
	return `${env.NEXT_PUBLIC_API_URL}/graphql`;
}

export async function getServerApolloLink() {
	const { cookies } = await import("next/headers");
	const cookieStore = await cookies();

	const cookieLink = new SetContextLink((prevContext) => ({
		...prevContext,
		headers: {
			...prevContext["headers"],
			Cookie: cookieStore.toString(),
		},
	}));

	return ApolloLink.from([
		cookieLink,
		new HttpLink({ uri: getServerUri(), credentials: "include" }),
	]);
}

export function getClientApolloLink() {
	const uri = getClientUri();
	return ApolloLink.from([makeAuthLink(uri), new HttpLink({ uri, credentials: "include" })]);
}
