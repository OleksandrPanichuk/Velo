import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["test/unit/**/*.spec.ts"],
		setupFiles: ["reflect-metadata"],
		coverage: {
			provider: "v8",
			include: ["src/**/*.ts"],
			exclude: ["src/**/*.module.ts", "src/main.ts", "src/instrument.ts"],
			reportsDirectory: "./coverage",
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
		},
	},
});
