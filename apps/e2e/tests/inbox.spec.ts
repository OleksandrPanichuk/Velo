import { buildUser, test } from "@/fixtures";

test.describe("workspace inbox", () => {
	test("a brand-new workspace shows the empty inbox state", async ({ pages, workspace }) => {
		await pages.inbox.goto(workspace.slug);

		await pages.inbox.expectLoaded();
		await pages.inbox.expectEmptyState();
		await pages.inbox.expectNotificationCount(0);
		await pages.inbox.expectNoUnread();
		await pages.inbox.expectNoError();
	});

	test("the owner is notified when an invited member joins", async ({
		pages,
		api,
		mail,
		signedInUser,
		workspace,
	}) => {
		const invitee = buildUser();
		await api.inviteMember(workspace.id, invitee.email, "MEMBER");
		const token = await mail.waitForInviteToken(invitee.email);
		await api.signUp(invitee);
		await api.signIn(invitee.email, invitee.password);
		await api.acceptInvite(token);

		await api.signIn(signedInUser.credentials.email, signedInUser.credentials.password);

		await pages.inbox.gotoWithNotifications(workspace.slug, 1);

		await pages.inbox.expectLoaded();
		await pages.inbox.expectNoEmptyState();
		await pages.inbox.expectMemberJoinedNotification();
		await pages.inbox.expectUnreadCount(1);
	});

	test("marking a notification as read updates the UI without a reload", async ({
		pages,
		api,
		mail,
		signedInUser,
		workspace,
	}) => {
		const invitee = buildUser();
		await api.inviteMember(workspace.id, invitee.email, "MEMBER");
		const token = await mail.waitForInviteToken(invitee.email);
		await api.signUp(invitee);
		await api.signIn(invitee.email, invitee.password);
		await api.acceptInvite(token);

		await api.signIn(signedInUser.credentials.email, signedInUser.credentials.password);

		await pages.inbox.gotoWithNotifications(workspace.slug, 1);
		await pages.inbox.expectUnreadCount(1);

		await pages.inbox.markFirstAsRead();

		await pages.inbox.expectNoUnread();
		await pages.inbox.expectNoMarkAsReadControls();
		await pages.inbox.expectMemberJoinedNotification();
		await pages.inbox.expectNotificationCount(1);
	});

	test("mark all as read clears every unread indicator", async ({
		pages,
		api,
		mail,
		signedInUser,
		workspace,
	}) => {
		const first = buildUser();
		await api.inviteMember(workspace.id, first.email, "MEMBER");
		const firstToken = await mail.waitForInviteToken(first.email);
		await api.signUp(first);
		await api.signIn(first.email, first.password);
		await api.acceptInvite(firstToken);

		await api.signIn(signedInUser.credentials.email, signedInUser.credentials.password);

		const second = buildUser();
		await api.inviteMember(workspace.id, second.email, "MEMBER");
		const secondToken = await mail.waitForInviteToken(second.email);
		await api.signUp(second);
		await api.signIn(second.email, second.password);
		await api.acceptInvite(secondToken);

		await api.signIn(signedInUser.credentials.email, signedInUser.credentials.password);

		await pages.inbox.gotoWithNotifications(workspace.slug, 2);
		await pages.inbox.expectUnreadCount(2);

		await pages.inbox.markAllAsRead();

		await pages.inbox.expectNoUnread();
		await pages.inbox.expectNoMarkAsReadControls();
		await pages.inbox.expectMemberJoinedNotification(2);
		await pages.inbox.expectNotificationCount(2);
	});
});
