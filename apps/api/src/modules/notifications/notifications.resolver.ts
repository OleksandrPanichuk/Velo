import { PUBSUB } from "@/infrastructure/pubsub/pubsub.constants";
import { NotificationModel } from "@/models/Notification.model";
import { CurrentUser } from "@/shared/decorators";
import { Inject } from "@nestjs/common";
import { Args, Resolver } from "@nestjs/graphql";
import type { RedisPubSub } from "graphql-redis-subscriptions";
import { UUIDResolver } from "graphql-scalars";
import { NOTIFICATION_RECEIVED_EVENT } from "./notifications.constants";
import {
	GetNotificationsQuery,
	GetUnreadNotificationsCountQuery,
	MarkAllNotificationsAsReadMutation,
	MarkNotificationAsReadMutation,
	NotificationReceivedSubscription,
} from "./notifications.decorators";
import { NotificationsService } from "./notifications.service";

@Resolver()
export class NotificationsResolver {
	constructor(
		private readonly notificationsService: NotificationsService,
		@Inject(PUBSUB) private readonly pubSub: RedisPubSub,
	) {}

	@GetNotificationsQuery()
	public async notifications(
		@CurrentUser("id") userId: string,
		@Args("workspaceId", { type: () => UUIDResolver }) workspaceId: string,
	): Promise<NotificationModel[]> {
		return this.notificationsService.findByRecipientAndWorkspace(userId, workspaceId);
	}

	@GetUnreadNotificationsCountQuery()
	public async unreadNotificationsCount(
		@CurrentUser("id") userId: string,
		@Args("workspaceId", { type: () => UUIDResolver }) workspaceId: string,
	): Promise<number> {
		return this.notificationsService.countUnread(userId, workspaceId);
	}

	@MarkNotificationAsReadMutation()
	public async markNotificationAsRead(
		@CurrentUser("id") userId: string,
		@Args("id", { type: () => UUIDResolver }) id: string,
	): Promise<NotificationModel> {
		return this.notificationsService.markAsRead(id, userId);
	}

	@MarkAllNotificationsAsReadMutation()
	public async markAllNotificationsAsRead(
		@CurrentUser("id") userId: string,
		@Args("workspaceId", { type: () => UUIDResolver }) workspaceId: string,
	): Promise<boolean> {
		await this.notificationsService.markAllAsRead(userId, workspaceId);
		return true;
	}

	@NotificationReceivedSubscription()
	public notificationReceived(): AsyncIterableIterator<unknown> {
		return this.pubSub.asyncIterator(NOTIFICATION_RECEIVED_EVENT);
	}
}
