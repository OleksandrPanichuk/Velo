import { buildUser, buildWorkspace, test } from "@/fixtures";

test.describe("workspace invites", () => {
	test("owner invites an address, it shows up as pending and the invite email arrives", async ({
		pages,
		mail,
		workspace,
	}) => {
		const invitee = buildUser();

		await pages.members.goto(workspace.slug);
		await pages.members.expectLoaded();
		await pages.members.expectInviteSectionVisible();

		await pages.members.invite(invitee.email);

		await pages.members.expectInviteSuccess(invitee.email);
		await pages.members.expectPendingInvite(invitee.email);
		await pages.members.expectNoError();

		await mail.waitForInviteLink(invitee.email);
	});

	test("revoking a pending invite removes it from the list", async ({ pages, api, workspace }) => {
		const invitee = buildUser();
		await api.inviteMember(workspace.id, invitee.email, "MEMBER");

		await pages.members.goto(workspace.slug);
		await pages.members.expectPendingInvite(invitee.email);

		await pages.members.revokeInvite(invitee.email);

		await pages.members.expectNoPendingInvite(invitee.email);
		await pages.members.expectNoPendingInvites();
	});

	test("a brand-new invitee registers from the invite link and lands inside the inviter's workspace", async ({
		pages,
		api,
		mail,
	}) => {
		test.slow();

		const owner = buildUser();
		await api.signUp(owner);
		await api.signIn(owner.email, owner.password);

		const { createWorkspace } = await api.createWorkspace(buildWorkspace());

		const invitee = buildUser();
		await api.inviteMember(createWorkspace.id, invitee.email, "MEMBER");

		const token = await mail.waitForInviteToken(invitee.email);

		await api.signOut();

		await pages.invite.gotoWithToken(token);
		await pages.invite.expectAuthPrompt();
		await pages.invite.gotoRegisterFromPrompt();

		await pages.register.expectLoaded();
		await pages.register.expectInviteTokenCarried(token);

		await pages.register.register(invitee);

		await pages.shell.expectInsideWorkspace(createWorkspace.slug);

		await pages.members.goto(createWorkspace.slug);
		await pages.members.expectMemberEmailListed(invitee.email);
	});

	test("an invite addressed to another email tells the signed-in user to use the invited address", async ({
		pages,
		api,
		mail,
		workspace,
	}) => {
		const invitee = buildUser();
		await api.inviteMember(workspace.id, invitee.email, "MEMBER");

		const token = await mail.waitForInviteToken(invitee.email);

		const bystander = buildUser();
		await api.signUp(bystander);
		await api.signIn(bystander.email, bystander.password);

		await pages.invite.gotoWithToken(token);

		await pages.invite.expectWrongEmailFor(bystander.email);
	});

	test("an unknown token shows the not-found state", async ({ pages, signedInUser }) => {
		void signedInUser;

		await pages.invite.gotoWithToken("totally-made-up-token");

		await pages.invite.expectNotFound();
	});

	test("the invite page without a token shows the missing-token state", async ({ pages }) => {
		await pages.invite.gotoWithoutToken();

		await pages.invite.expectMissingToken();
	});

	test("reusing an accepted invite link shows the already-used state", async ({
		pages,
		api,
		mail,
		workspace,
	}) => {
		const invitee = buildUser();
		await api.inviteMember(workspace.id, invitee.email, "MEMBER");

		const token = await mail.waitForInviteToken(invitee.email);

		await api.signUp(invitee);
		await api.signIn(invitee.email, invitee.password);
		await api.acceptInvite(token);

		await pages.invite.gotoWithToken(token);

		await pages.invite.expectAlreadyAccepted();
	});
});
