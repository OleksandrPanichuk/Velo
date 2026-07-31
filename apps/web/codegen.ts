import type { CodegenConfig } from "@graphql-codegen/cli";
import * as dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const sharedConfig = {
	avoidOptionals: true,
	scalars: {
		DateTime: "string",
		UUID: "string",
		EmailAddress: "string",
		JSON: "Record<string, unknown>",
	},
};

const config: CodegenConfig = {
	schema: `${API_URL}/graphql`,
	documents: ["src/**/*.graphql"],
	ignoreNoDocuments: true,
	generates: {
		"src/graphql/types.ts": {
			// `typescript-operations` v6 emits the schema types its operations reference
			// (inputs, enums) on its own, so pairing it with the `typescript` plugin in a
			// single output declares every input and enum twice. Operations + documents is
			// all this file is consumed for, so `typescript` is redundant here.
			plugins: ["typescript-operations", "@graphql-codegen/typed-document-node"],
			config: {
				...sharedConfig,
				documentVariableSuffix: "",
				dedupeFragments: true,
			},
		},
		"src/graphql/hooks.ts": {
			plugins: [{ add: { content: "// @ts-nocheck\n" } }, "typescript-react-apollo"],
			config: {
				...sharedConfig,
				withHooks: true,
				withMutationFn: false,
				withMutationOptionsType: false,
				dedupeFragments: true,
				apolloReactHooksImportFrom: "@apollo/client/react",
				apolloReactCommonImportFrom: "@apollo/client/react",
				documentMode: "external",
				importDocumentNodeExternallyFrom: "./types",
				importOperationTypesFrom: "Operations",
			},
		},
	},
};

export default config;
