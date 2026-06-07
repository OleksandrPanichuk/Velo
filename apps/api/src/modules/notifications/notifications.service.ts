import { PUBSUB } from "@/infrastructure/pubsub/pubsub.constants";
import { NotificationModel } from "@/models/Notification.model";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { RedisPubSub } from "graphql-redis-subscriptions";
import { NOTIFICATION_RECEIVED_EVENT } from "./notifications.constants";
import type { CreateNotificationData, NotificationsRepository } from "./notifications.repository";

@Injectable()
export class NotificationsService {
	constructor(
		private readonly notificationsRepository: NotificationsRepository,
		@Inject(PUBSUB) private readonly pubSub: RedisPubSub,
	) {}

	public async create(data: CreateNotificationData): Promise<NotificationModel> {
		const notification = await this.notificationsRepository.create({
			...data,
		});
		await this.pubSub.publish(NOTIFICATION_RECEIVED_EVENT, { notificationReceived: notification });
		return notification;
	}

	public async findByRecipientAndWorkspace(
		recipientId: string,
		workspaceId: string,
	): Promise<NotificationModel[]> {
		return this.notificationsRepository.findByRecipientAndWorkspace(recipientId, workspaceId);
	}

	public async countUnread(recipientId: string, workspaceId: string): Promise<number> {
		return this.notificationsRepository.countUnread(recipientId, workspaceId);
	}

	public async markAsRead(id: string, recipientId: string): Promise<NotificationModel> {
		const notification = await this.notificationsRepository.markAsRead(id, recipientId);
		if (!notification) throw new NotFoundException("Notification not found");
		return notification;
	}

	public async markAllAsRead(recipientId: string, workspaceId: string): Promise<void> {
		await this.notificationsRepository.markAllAsRead(recipientId, workspaceId);
	}
}
