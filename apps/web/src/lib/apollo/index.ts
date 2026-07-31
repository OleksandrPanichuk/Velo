import { disableFragmentWarnings } from "@apollo/client";
import {
	ApolloClient,
	InMemoryCache,
	registerApolloClient,
} from "@apollo/client-integration-nextjs";

import { getServerApolloLink } from "./link";

disableFragmentWarnings();

export const { getClient, query, PreloadQuery } = registerApolloClient(async () => {
	return new ApolloClient({
		cache: new InMemoryCache(),
		link: await getServerApolloLink(),
	});
});

export { WORKSPACE_ID_HEADER, workspaceContext } from "./workspace-context";
