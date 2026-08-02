import { nextJsConfig } from "@repo/eslint-config/next-js";

export default [
	...nextJsConfig,
	{ ignores: ["src/graphql/types.ts", "src/graphql/hooks.ts"] },
];
