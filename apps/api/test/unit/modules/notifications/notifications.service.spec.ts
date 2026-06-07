import { NotificationType } from "@/enums";
import { NotificationsService } from "@/modules/notifications/notifications.service";
import type { NotificationsRepository } from "@/modules/notifications/notifications.repository";
import { NotFoundException } from "@nestjs/common";
import { PUBSUB } from "@/infrastructure/pubsub/pubsub.constants";
import { NOTIFICATION_RECEIVED_EVENT } from "@/modules/notifications/notifications.constants";

const mockRepo: Partial<NotificationsRepository> = {
  create: vi.fn(),
  findByRecipientAndWorkspace: vi.fn(),
  countUnread: vi.fn(),
  markAsRead: vi.fn(),
  markAllAsRead: vi.fn(),
};

const mockPubSub = { publish: vi.fn() };

const buildService = () =>
  new NotificationsService(mockRepo as NotificationsRepository, mockPubSub as never);

describe("NotificationsService", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("create", () => {
    it("saves the notification and publishes to pubsub", async () => {
      const notification = { id: "notif-1", recipientId: "user-1" };
      vi.mocked(mockRepo.create!).mockResolvedValue(notification as never);
      vi.mocked(mockPubSub.publish).mockResolvedValue(undefined);

      const result = await buildService().create({
        recipientId: "user-1",
        workspaceId: "ws-1",
        actorId: "user-2",
        type: NotificationType.MEMBER_JOINED,
        title: "A new member joined your workspace",
      });

      expect(mockRepo.create).toHaveBeenCalledWith({
        recipientId: "user-1",
        workspaceId: "ws-1",
        actorId: "user-2",
        type: NotificationType.MEMBER_JOINED,
        title: "A new member joined your workspace",
        body: undefined,
      });
      expect(mockPubSub.publish).toHaveBeenCalledWith(NOTIFICATION_RECEIVED_EVENT, {
        notificationReceived: notification,
      });
      expect(result).toBe(notification);
    });
  });

  describe("findByRecipientAndWorkspace", () => {
    it("delegates to the repository", async () => {
      const notifications = [{ id: "n1" }, { id: "n2" }];
      vi.mocked(mockRepo.findByRecipientAndWorkspace!).mockResolvedValue(notifications as never);

      const result = await buildService().findByRecipientAndWorkspace("user-1", "ws-1");

      expect(mockRepo.findByRecipientAndWorkspace).toHaveBeenCalledWith("user-1", "ws-1");
      expect(result).toBe(notifications);
    });
  });

  describe("countUnread", () => {
    it("returns the unread count from the repository", async () => {
      vi.mocked(mockRepo.countUnread!).mockResolvedValue(5);

      const result = await buildService().countUnread("user-1", "ws-1");

      expect(mockRepo.countUnread).toHaveBeenCalledWith("user-1", "ws-1");
      expect(result).toBe(5);
    });
  });

  describe("markAsRead", () => {
    it("returns the updated notification", async () => {
      const notification = { id: "n1", isRead: true };
      vi.mocked(mockRepo.markAsRead!).mockResolvedValue(notification as never);

      const result = await buildService().markAsRead("n1", "user-1");

      expect(mockRepo.markAsRead).toHaveBeenCalledWith("n1", "user-1");
      expect(result).toBe(notification);
    });

    it("throws NotFoundException when the notification does not exist", async () => {
      vi.mocked(mockRepo.markAsRead!).mockResolvedValue(null);

      await expect(buildService().markAsRead("n1", "user-1")).rejects.toThrow(NotFoundException);
    });
  });

  describe("markAllAsRead", () => {
    it("delegates to the repository", async () => {
      vi.mocked(mockRepo.markAllAsRead!).mockResolvedValue(undefined);

      await buildService().markAllAsRead("user-1", "ws-1");

      expect(mockRepo.markAllAsRead).toHaveBeenCalledWith("user-1", "ws-1");
    });
  });
});
