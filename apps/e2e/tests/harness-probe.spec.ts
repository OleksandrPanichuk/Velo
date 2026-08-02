import { expect, test } from "@/fixtures";

test.describe("harness wiring", () => {
	test("auth pages expose their data-qa", async ({ pages }) => {
		await pages.login.goto();
		await pages.login.expectLoaded();

		await pages.register.goto();
		await pages.register.expectLoaded();
		await pages.register.expectOAuthAvailable();

		await pages.forgotPassword.goto();
		await pages.forgotPassword.expectLoaded();

		await pages.resetPassword.gotoWithoutToken();
		await pages.resetPassword.expectInvalidToken();

		await pages.verifyEmail.gotoWithoutToken();
		await pages.verifyEmail.expectMissingToken();

		await pages.invite.gotoWithoutToken();
		await pages.invite.expectMissingToken();
	});

	test("workspace pages expose their data-qa", async ({ pages, workspace }) => {
		await pages.shell.gotoWorkspace(workspace.slug);
		await pages.shell.expectLoaded();
		await pages.shell.expectOnInbox(workspace.slug);
		await pages.shell.expectWorkspaceName(workspace.name);
		await pages.shell.expectActiveNav("Inbox");
		await pages.shell.expectPlaceholderDisabled("My Issues");

		await pages.inbox.expectLoaded();
		await pages.inbox.expectEmptyState();
		await pages.inbox.expectNoUnread();

		await pages.members.goto(workspace.slug);
		await pages.members.expectLoaded();
		await pages.members.expectInviteSectionVisible();

		await pages.settings.goto(workspace.slug);
		await pages.settings.expectLoaded();
		await pages.settings.expectReadOnlyNotice();
		await pages.settings.expectNoSaveControl();
	});

	test("a foreign slug renders not found", async ({ pages, signedInUser }) => {
		void signedInUser;
		await pages.shell.gotoWorkspace("definitely-not-a-real-workspace");
		await pages.notFound.expectShown();
	});
});
