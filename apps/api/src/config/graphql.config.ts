import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import type { ApolloDriverConfig } from "@nestjs/apollo";
import {
	DateTimeResolver,
	EmailAddressResolver,
	UUIDResolver,
} from "graphql-scalars";
import { join } from "path";

const scalarResolvers = {
	DateTime: DateTimeResolver,
	EmailAddress: EmailAddressResolver,
	UUID: UUIDResolver,
};

export const getGraphQLConfig = (): Omit<ApolloDriverConfig, "driver"> => ({
	autoSchemaFile: join(process.cwd(), "src/schema.gql"),
	sortSchema: true,
	context: ({ req }) => ({ req }),
	resolvers: scalarResolvers,
	playground: false,
	plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

