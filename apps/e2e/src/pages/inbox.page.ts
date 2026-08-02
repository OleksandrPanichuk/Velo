import { expect, type Page } from "@playwright/test";

import { InboxEmptyStateHarness } from "@web/features/notifications/ui/components/InboxEmptyState.harness";
import { NotificationItemHarness } from "@web/features/notifications/ui/components/NotificationItem.harness";
import { InboxViewHarness } from "@web/features/notifications/ui/views/InboxView/InboxView.harness";

import { byQa } from "@/helpers/qa";
import { BasePage } from "@/pages/base.page";

const MEMBER_JOINED_TITLE = "A new member joined your workspace";

export class InboxPage extends BasePage {
	protected readonly path = "/";

	private readonly root = byQa(this.page, InboxViewHarness.Root);
	private readonly heading = byQa(this.page, InboxViewHarness.Heading);
	private readonly unreadBadge = byQa(this.page, InboxViewHarness.UnreadBadge);
	private readonly markAllButton = byQa(this.page, InboxViewHarness.MarkAllAsRead);
	private readonly error = byQa(this.page, InboxViewHarness.Error);
	private readonly emptyState = byQa(this.page, InboxEmptyStateHarness.Root);
	private readonly items = byQa(this.page, NotificationItemHarness.Root);
	private readonly unreadMarkers = byQa(this.page, NotificationItemHarness.UnreadMarker);
	private readonly markAsReadButtons = byQa(this.page, NotificationItemHarness.MarkAsRead);

	constructor(page: Page) {
		super(page);
	}

	async goto(slug: string) {
		await super.goto(`/${slug}/inbox`);
	}

	async gotoWithNotifications(slug: string, count: number) {
		await expect
			.poll(
				async () => {
					await this.goto(slug);
					await expect(this.emptyState.or(this.items.first())).toBeVisible();

					return this.items.count();
				},
				{
					message: `waiting for ${count} notification(s) in the inbox`,
					timeout: 30_000,
					intervals: [500, 1000, 2000],
				},
			)
			.toBeGreaterThanOrEqual(count);
	}

	async markFirstAsRead() {
		await this.markAsReadButtons.first().click();
	}

	async markAllAsRead() {
		await this.markAllButton.click();
	}

	async expectLoaded() {
		await this.expectVisible(this.root);
		await expect(this.heading).toHaveText("Inbox");
	}

	async expectNotShown() {
		await expect(this.root).toHaveCount(0);
	}

	async expectEmptyState() {
		await this.expectVisible(this.emptyState);
	}

	async expectNoEmptyState() {
		await expect(this.emptyState).toHaveCount(0);
	}

	async expectMemberJoinedNotification(count = 1) {
		await expect(this.items.filter({ hasText: MEMBER_JOINED_TITLE })).toHaveCount(count);
		await expect(this.items.filter({ hasText: MEMBER_JOINED_TITLE }).first()).toBeVisible();
	}

	async expectNoMarkAsReadControls() {
		await expect(this.markAsReadButtons).toHaveCount(0);
	}

	async expectNotification(text: string | RegExp) {
		await expect(this.items.filter({ hasText: text })).toBeVisible();
	}

	async expectNotificationCount(count: number) {
		await expect(this.items).toHaveCount(count);
	}

	async expectUnreadCount(count: number) {
		await expect(this.unreadBadge).toHaveText(`${count} unread`);
		await expect(this.unreadMarkers).toHaveCount(count);
	}

	async expectNoUnread() {
		await expect(this.unreadBadge).toHaveCount(0);
		await expect(this.unreadMarkers).toHaveCount(0);
		await expect(this.markAllButton).toHaveCount(0);
	}

	async expectNoError() {
		await expect(this.error).toHaveCount(0);
	}
}
