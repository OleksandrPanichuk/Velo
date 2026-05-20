"use client";

import { disableFragmentWarnings } from "@apollo/client";
import {
	ApolloClient,
	ApolloNextAppProvider,
	InMemoryCache,
} from "@apollo/client-integration-nextjs";
import type { PropsWithChildren } from "react";

import { getClientApolloLink } from "@/lib/apollo/link";

disableFragmentWarnings();

function makeClient() {
	return new ApolloClient({
		cache: new InMemoryCache(),
		link: getClientApolloLink(),
	});
}

export function ApolloProvider({ children }: PropsWithChildren) {
	return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
