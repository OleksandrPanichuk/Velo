import { buildUser, buildWorkspace, test } from "@/fixtures";

const PLACEHOLDERS = ["My Issues", "Projects", "Teams", "Favorites"];

test.describe("workspace shell", () => {
	test("redirects the workspace root to the inbox", async ({ pages, workspace }) => {
		await pages.shell.gotoWorkspace(workspace.slug);

		await pages.shell.expectOnInbox(workspace.slug);
		await pages.shell.expectLoaded();
		await pages.inbox.expectLoaded();
	});

	test("navigates between inbox, members and settings and marks the active item", async ({
		pages,
		workspace,
	}) => {
		await pages.shell.gotoInbox(workspace.slug);
		await pages.shell.expectActiveNav("Inbox");

		await pages.shell.clickNav("Members");
		await pages.shell.expectOnMembers(workspace.slug);
		await pages.members.expectLoaded();
		await pages.shell.expectActiveNav("Members");
		await pages.shell.expectInactiveNav("Inbox");

		await pages.shell.clickNav("Settings");
		await pages.shell.expectOnSettings(workspace.slug);
		await pages.settings.expectLoaded();
		await pages.shell.expectActiveNav("Settings");
		await pages.shell.expectInactiveNav("Members");

		await pages.shell.clickNav("Inbox");
		await pages.shell.expectOnInbox(workspace.slug);
		await pages.inbox.expectLoaded();
		await pages.shell.expectActiveNav("Inbox");
		await pages.shell.expectInactiveNav("Settings");
	});

	test("shows unbuilt nav entries as visible but non-interactive labels", async ({
		pages,
		workspace,
	}) => {
		await pages.shell.gotoInbox(workspace.slug);
		await pages.shell.expectLoaded();

		for (const label of PLACEHOLDERS) {
			await pages.shell.expectPlaceholderNotInteractive(label);
			await pages.shell.expectNoNavLink(label);
		}
	});

	test("renders not found for a workspace the user does not belong to", async ({
		pages,
		api,
		signedInUser,
	}) => {
		const outsider = buildUser();
		await api.signUp(outsider);
		await api.signIn(outsider.email, outsider.password);
		const { createWorkspace: foreign } = await api.createWorkspace(buildWorkspace());

		await api.signIn(signedInUser.credentials.email, signedInUser.credentials.password);

		await pages.shell.gotoInbox(foreign.slug);

		await pages.notFound.expectShown();
		await pages.inbox.expectNotShown();
	});

	test("renders not found for an unknown workspace slug", async ({ pages, signedInUser }) => {
		void signedInUser;

		await pages.shell.gotoInbox(buildWorkspace().slug);

		await pages.notFound.expectShown();
		await pages.inbox.expectNotShown();
	});

	test("switches between the user's own workspaces", async ({ pages, api, workspace }) => {
		const { createWorkspace: second } = await api.createWorkspace(buildWorkspace());

		await pages.shell.gotoInbox(workspace.slug);
		await pages.shell.expectWorkspaceName(workspace.name);

		await pages.shell.expectSwitcherLists([workspace.name, second.name]);
		await pages.shell.chooseWorkspace(second.name);

		await pages.shell.expectOnInbox(second.slug);
		await pages.shell.expectWorkspaceName(second.name);

		await pages.shell.switchToWorkspace(workspace.name);

		await pages.shell.expectOnInbox(workspace.slug);
		await pages.shell.expectWorkspaceName(workspace.name);
	});
});
