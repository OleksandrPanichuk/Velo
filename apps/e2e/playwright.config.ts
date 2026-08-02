import { defineConfig, devices } from "@playwright/test";

import { API_URL, apiEnv, E2E_WEB_PORT, WEB_URL, webEnv } from "./src/config";

export default defineConfig({
	testDir: "./tests",
	globalSetup: "./src/global-setup.ts",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 2 : undefined,
	reporter: process.env.CI ? [["github"], ["list"]] : [["list"], ["html", { open: "never" }]],
	timeout: 45_000,
	expect: { timeout: 10_000 },
	use: {
		baseURL: WEB_URL,
		trace: "on-first-retry",
		screenshot: "only-on-failure",
		video: "retain-on-failure",
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
	webServer: [
		{
			command: "bun run start",
			cwd: "../api",
			url: `${API_URL}/health`,
			env: apiEnv,
			reuseExistingServer: !process.env.CI,
			timeout: 180_000,
			stdout: "pipe",
			stderr: "pipe",
		},
		{
			command: `bun run build && bun run start --port ${E2E_WEB_PORT}`,
			cwd: "../web",
			url: WEB_URL,
			env: webEnv,
			reuseExistingServer: !process.env.CI,
			timeout: 180_000,
			stdout: "pipe",
			stderr: "pipe",
		},
	],
});
