/**
 * Integration test for NotificationsResolver.
 *
 * Uses the real NotificationsService wired to a mocked repository.
 * Tests beyond the unit layer:
 * - NotFoundException from the real service propagates through the resolver
 * - markAllNotificationsAsRead returns true after the service call succeeds
 * - notificationReceived subscription hands back a live asyncIterator
 */
import { PUBSUB } from "@/infrastructure/pubsub/pubsub.constants";
import { NotificationsRepository } from "@/modules/notifications/notifications.repository";
import { NotificationsResolver } from "@/modules/notifications/notifications.resolver";
import { NotificationsService } from "@/modules/notifications/notifications.service";
import { NotFoundException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { NOTIFICATION_RECEIVED_EVENT } from "@/modules/notifications/notifications.constants";
import { mockNotificationsRepository, mockPubSub } from "../../../helpers/mocks";
import { NotificationFactory, UserFactory, WorkspaceFactory } from "../../../factories";

let module: TestingModule;
let resolver: NotificationsResolver;
let repo: ReturnType<typeof mockNotificationsRepository>;
let pubSub: ReturnType<typeof mockPubSub>;

beforeAll(async () => {
	repo = mockNotificationsRepository();
	pubSub = mockPubSub();

	module = await Test.createTestingModule({
		providers: [
			NotificationsResolver,
			NotificationsService,
			{ provide: NotificationsRepository, useValue: repo },
			{ provide: PUBSUB, useValue: pubSub },
		],
	}).compile();

	resolver = module.get(NotificationsResolver);
});

afterAll(async () => module.close());
beforeEach(() => vi.clearAllMocks());

describe("NotificationsResolver integration", () => {
	const user = UserFactory.buildVerified();
	const workspace = WorkspaceFactory.build();

	describe("notifications()", () => {
		it("returns notifications from the real service chain", async () => {
			const notifications = NotificationFactory.buildList(3, {
				recipientId: user.id,
				workspaceId: workspace.id,
			});
			vi.mocked(repo.findByRecipientAndWorkspace).mockResolvedValue(notifications);

			const result = await resolver.notifications(user.id, workspace.id);

			expect(result).toBe(notifications);
			expect(result).toHaveLength(3);
		});
	});

	describe("unreadNotificationsCount()", () => {
		it("returns the count from the real service chain", async () => {
			vi.mocked(repo.countUnread).mockResolvedValue(7);

			const result = await resolver.unreadNotificationsCount(user.id, workspace.id);

			expect(result).toBe(7);
		});
	});

	describe("markNotificationAsRead()", () => {
		it("returns the updated notification when found", async () => {
			const notification = NotificationFactory.build({ recipientId: user.id, isRead: true });
			vi.mocked(repo.markAsRead).mockResolvedValue(notification);
			vi.mocked(pubSub.publish).mockResolvedValue(undefined);

			const result = await resolver.markNotificationAsRead(user.id, notification.id);

			expect(result).toBe(notification);
			expect(result.isRead).toBe(true);
		});

		it("throws NotFoundException through the real service when notification is not found", async () => {
			vi.mocked(repo.markAsRead).mockResolvedValue(null);

			await expect(resolver.markNotificationAsRead(user.id, "non-existent-id")).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe("markAllNotificationsAsRead()", () => {
		it("returns true after service marks all as read", async () => {
			vi.mocked(repo.markAllAsRead).mockResolvedValue(undefined);

			const result = await resolver.markAllNotificationsAsRead(user.id, workspace.id);

			expect(result).toBe(true);
			expect(repo.markAllAsRead).toHaveBeenCalledWith(user.id, workspace.id);
		});
	});

	describe("notificationReceived()", () => {
		it("returns an async iterator for the pubsub event", () => {
			const fakeIterator = { next: vi.fn() };
			vi.mocked(pubSub.asyncIterator).mockReturnValue(fakeIterator);

			const result = resolver.notificationReceived();

			expect(pubSub.asyncIterator).toHaveBeenCalledWith(NOTIFICATION_RECEIVED_EVENT);
			expect(result).toBe(fakeIterator);
		});
	});
});
