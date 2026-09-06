import { type NotificationModel } from "@/models/Notification.model";
import { NOTIFICATION_RECEIVED_EVENT } from "@/modules/notifications/notifications.constants";
import { NotificationsResolver } from "@/modules/notifications/notifications.resolver";
import { type NotificationsService } from "@/modules/notifications/notifications.service";

const mockNotificationsService: Partial<NotificationsService> = {
	findByRecipientAndWorkspace: vi.fn(),
	countUnread: vi.fn(),
	markAsRead: vi.fn(),
	markAllAsRead: vi.fn(),
};

const mockAsyncIterator = {};
const mockPubSub = {
	asyncIterator: vi.fn().mockReturnValue(mockAsyncIterator),
};

const buildResolver = () =>
	new NotificationsResolver(mockNotificationsService as NotificationsService, mockPubSub as never);

describe("NotificationsResolver", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("notifications", () => {
		it("returns notifications for the current user and workspace", async () => {
			const notifications = [{ id: "n1" }, { id: "n2" }];
			vi.mocked(mockNotificationsService.findByRecipientAndWorkspace!).mockResolvedValue(
				notifications as NotificationModel[],
			);

			const result = await buildResolver().notifications("u1", "ws1");

			expect(mockNotificationsService.findByRecipientAndWorkspace).toHaveBeenCalledWith(
				"u1",
				"ws1",
			);
			expect(result).toBe(notifications);
		});
	});

	describe("unreadNotificationsCount", () => {
		it("returns unread count for the current user and workspace", async () => {
			vi.mocked(mockNotificationsService.countUnread!).mockResolvedValue(3);

			const result = await buildResolver().unreadNotificationsCount("u1", "ws1");

			expect(mockNotificationsService.countUnread).toHaveBeenCalledWith("u1", "ws1");
			expect(result).toBe(3);
		});
	});

	describe("markNotificationAsRead", () => {
		it("marks notification as read and returns updated notification", async () => {
			const notification = { id: "n1", isRead: true };
			vi.mocked(mockNotificationsService.markAsRead!).mockResolvedValue(
				notification as NotificationModel,
			);

			const result = await buildResolver().markNotificationAsRead("u1", "n1");

			expect(mockNotificationsService.markAsRead).toHaveBeenCalledWith("n1", "u1");
			expect(result).toBe(notification);
		});
	});

	describe("markAllNotificationsAsRead", () => {
		it("marks all notifications as read and returns true", async () => {
			vi.mocked(mockNotificationsService.markAllAsRead!).mockResolvedValue(undefined);

			const result = await buildResolver().markAllNotificationsAsRead("u1", "ws1");

			expect(mockNotificationsService.markAllAsRead).toHaveBeenCalledWith("u1", "ws1");
			expect(result).toBe(true);
		});
	});

	describe("notificationReceived", () => {
		it("returns async iterator for the notification received event", () => {
			const result = buildResolver().notificationReceived();

			expect(mockPubSub.asyncIterator).toHaveBeenCalledWith(NOTIFICATION_RECEIVED_EVENT);
			expect(result).toBe(mockAsyncIterator);
		});
	});
});
