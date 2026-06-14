import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["test/integration/**/*.spec.ts"],
		setupFiles: ["reflect-metadata"],
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "../src"),
		},
	},
});
