import { buildUser, test } from "@/fixtures";

const INVITE_SUBJECT = "You have been invited to a Velo workspace";

test.describe("workspace members", () => {
	test("the owner is listed with their email and an owner badge", async ({
		pages,
		signedInUser,
		workspace,
	}) => {
		await pages.members.goto(workspace.slug);
		await pages.members.expectLoaded();
		await pages.members.expectTeamCount(1);
		await pages.members.expectMemberEmailListed(signedInUser.credentials.email);
		await pages.members.expectMemberListed(signedInUser.credentials.email, "Owner");
	});

	test("the owner sees the invite section with no pending invites", async ({ pages, workspace }) => {
		await pages.members.goto(workspace.slug);
		await pages.members.expectLoaded();
		await pages.members.expectInviteSectionVisible();
		await pages.members.expectInviteFormReady();
		await pages.members.expectNoPendingInvites();
	});

	test("a plain member sees the list without the invite section and without errors", async ({
		api,
		mail,
		pages,
		signedInUser,
		workspace,
	}) => {
		const invitee = buildUser();

		await api.signUp(invitee);
		await api.signIn(signedInUser.credentials.email, signedInUser.credentials.password);
		await api.inviteMember(workspace.id, invitee.email, "MEMBER");

		const token = await mail.waitForToken(invitee.email, {
			subjectContains: INVITE_SUBJECT,
			urlContains: "/invite",
		});

		await api.signIn(invitee.email, invitee.password);
		await api.acceptInvite(token);

		await pages.members.goto(workspace.slug);
		await pages.members.expectLoaded();
		await pages.members.expectMemberListed(invitee.email, "Member");
		await pages.members.expectInviteSectionHidden();
		await pages.members.expectNoError();
	});

	test("an accepted invite puts both people in the list with their roles", async ({
		api,
		mail,
		pages,
		signedInUser,
		workspace,
	}) => {
		const invitee = buildUser();

		await api.signUp(invitee);
		await api.signIn(signedInUser.credentials.email, signedInUser.credentials.password);
		await api.inviteMember(workspace.id, invitee.email, "ADMIN");

		const token = await mail.waitForToken(invitee.email, {
			subjectContains: INVITE_SUBJECT,
			urlContains: "/invite",
		});

		await api.signIn(invitee.email, invitee.password);
		await api.acceptInvite(token);
		await api.signIn(signedInUser.credentials.email, signedInUser.credentials.password);

		await pages.members.goto(workspace.slug);
		await pages.members.expectLoaded();
		await pages.members.expectTeamCount(2);
		await pages.members.expectMemberListed(signedInUser.credentials.email, "Owner");
		await pages.members.expectMemberListed(invitee.email, "Admin");
		await pages.members.expectNoPendingInvites();
	});

	test("an invalid email shows a message and creates no pending invite", async ({
		pages,
		workspace,
	}) => {
		const invalidEmail = "teammate@invalid";

		await pages.members.goto(workspace.slug);
		await pages.members.expectLoaded();
		await pages.members.invite(invalidEmail);

		await pages.members.expectInviteValidationError();
		await pages.members.expectInviteEmailKept(invalidEmail);
		await pages.members.expectInviteFormReady();
		await pages.members.expectNoInviteSuccess();
		await pages.members.expectNoPendingInvites();
	});
});
