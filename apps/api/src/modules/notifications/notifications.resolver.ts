import { NotificationModel } from "@/models/Notification.model";
import { PUBSUB } from "@/infrastructure/pubsub/pubsub.constants";
import { NOTIFICATION_RECEIVED_EVENT } from "./notifications.constants";
import { CurrentUser } from "@/shared/decorators";
import { Inject } from "@nestjs/common";
import { Args, Resolver } from "@nestjs/graphql";
import { UUIDResolver } from "graphql-scalars";
import type { RedisPubSub } from "graphql-redis-subscriptions";
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
	public notifications(
		@CurrentUser("id") userId: string,
		@Args("workspaceId", { type: () => UUIDResolver }) workspaceId: string,
	): Promise<NotificationModel[]> {
		return this.notificationsService.findByRecipientAndWorkspace(userId, workspaceId);
	}

	@GetUnreadNotificationsCountQuery()
	public unreadNotificationsCount(
		@CurrentUser("id") userId: string,
		@Args("workspaceId", { type: () => UUIDResolver }) workspaceId: string,
	): Promise<number> {
		return this.notificationsService.countUnread(userId, workspaceId);
	}

	@MarkNotificationAsReadMutation()
	public markNotificationAsRead(
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
