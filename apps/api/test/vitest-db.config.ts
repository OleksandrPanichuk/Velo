/**
 * Vitest config for tests that require a real database + Redis.
 * Start infra first:  docker compose -f docker-compose.test.yml up -d
 */
import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["test/db/**/*.spec.ts"],
		setupFiles: ["reflect-metadata"],
		// Run serially — each spec file creates its own connection and truncates before each test.
		// fileParallelism: false prevents concurrent synchronize() calls that deadlock on schema locks.
		fileParallelism: false,
		pool: "forks",
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "../src"),
		},
	},
});
