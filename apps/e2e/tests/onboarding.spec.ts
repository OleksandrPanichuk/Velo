import { buildWorkspace, test } from "@/fixtures";

test.describe("onboarding", () => {
	test("sends a user without a workspace to onboarding", async ({ pages, signedInUser }) => {
		void signedInUser;

		await pages.onboarding.gotoRoot();

		await pages.onboarding.expectAt();
		await pages.onboarding.expectLoaded();
		await pages.onboarding.expectOnWorkspaceStep();
	});

	test("creates the workspace through the wizard and lands inside it", async ({
		pages,
		signedInUser,
	}) => {
		void signedInUser;

		const { slug } = buildWorkspace();
		const name = slug.replace(/-/g, " ");

		await pages.onboarding.goto();
		await pages.onboarding.expectOnWorkspaceStep();

		await pages.onboarding.fillWorkspace(name);
		await pages.onboarding.expectSlugDerivedFrom(slug);
		await pages.onboarding.continueFromWorkspace();

		await pages.onboarding.expectOnAboutStep();
		await pages.onboarding.chooseFirstRole();
		await pages.onboarding.chooseFirstTeamSize();
		await pages.onboarding.continueFromAbout();

		await pages.onboarding.expectReadyForSlug(slug);
		await pages.onboarding.finish();

		await pages.shell.expectOnInbox(slug);
		await pages.shell.expectLoaded();
		await pages.inbox.expectLoaded();
	});

	test("derives the URL from the typed name", async ({ pages, signedInUser }) => {
		void signedInUser;

		await pages.onboarding.goto();

		await pages.onboarding.fillWorkspace("My Cool Team 7");
		await pages.onboarding.expectSlugDerivedFrom("my-cool-team-7");

		await pages.onboarding.fillWorkspace("");
		await pages.onboarding.expectSlugEmpty();
	});

	test("keeps an invalid first step in place with validation messages", async ({
		pages,
		signedInUser,
	}) => {
		void signedInUser;

		await pages.onboarding.goto();

		await pages.onboarding.fillWorkspace("");
		await pages.onboarding.continueFromWorkspace();

		await pages.onboarding.expectRequiredErrors();
		await pages.onboarding.expectNotOnAboutStep();

		await pages.onboarding.fillWorkspace("Acme!!!");
		await pages.onboarding.continueFromWorkspace();

		await pages.onboarding.expectNameFormatError();
		await pages.onboarding.expectNotOnAboutStep();
	});
});
