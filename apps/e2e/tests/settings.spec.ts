import { test } from "@/fixtures";

test.describe("workspace settings", () => {
	test("shows the workspace name and slug", async ({ pages, workspace }) => {
		await pages.settings.goto(workspace.slug);
		await pages.settings.expectLoaded();
		await pages.settings.expectWorkspaceName(workspace.name);
		await pages.settings.expectWorkspaceUrl(workspace.slug);
	});

	test("is read-only and says so", async ({ pages, workspace }) => {
		await pages.settings.goto(workspace.slug);
		await pages.settings.expectLoaded();
		await pages.settings.expectReadOnlyNotice();
		await pages.settings.expectNoSaveControl();
	});

	test("the url row combines the app url with the slug", async ({ pages, workspace }) => {
		await pages.settings.goto(workspace.slug);
		await pages.settings.expectLoaded();
		await pages.settings.expectWorkspaceUrl(workspace.slug);
	});
});
