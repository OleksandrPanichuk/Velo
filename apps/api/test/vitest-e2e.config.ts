import { resolve } from "path";
import { defineConfig, type Plugin } from "vitest/config";

function graphqlPlugin(): Plugin {
	return {
		name: "graphql-loader",
		transform(code, id) {
			if (id.endsWith(".graphql")) {
				return `export default ${JSON.stringify(code)};`;
			}
		},
	};
}

export default defineConfig({
	plugins: [graphqlPlugin()],
	test: {
		globals: true,
		environment: "node",
		include: ["test/**/*.e2e-spec.ts"],
		setupFiles: ["reflect-metadata"],
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "../src"),
		},
	},
});
