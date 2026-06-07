import { NotificationModel } from "@/models/Notification.model";
import { applyDecorators } from "@nestjs/common";
import { Mutation, Query, Subscription } from "@nestjs/graphql";
import { NOTIFICATION_RECEIVED_EVENT } from "./notifications.constants";

export const GetNotificationsQuery = (): MethodDecorator =>
	applyDecorators(
		Query(() => [NotificationModel], {
			description: "Retrieve all notifications for the current user in a workspace.",
		}),
	);

export const GetUnreadNotificationsCountQuery = (): MethodDecorator =>
	applyDecorators(
		Query(() => Number, {
			description: "Count unread notifications for the current user in a workspace.",
		}),
	);

export const MarkNotificationAsReadMutation = (): MethodDecorator =>
	applyDecorators(
		Mutation(() => NotificationModel, {
			description: "Mark a single notification as read.",
		}),
	);

export const MarkAllNotificationsAsReadMutation = (): MethodDecorator =>
	applyDecorators(
		Mutation(() => Boolean, {
			description: "Mark all notifications in a workspace as read.",
		}),
	);

export const NotificationReceivedSubscription = (): MethodDecorator =>
	applyDecorators(
		Subscription(() => NotificationModel, {
			description: "Receive new notifications in real time.",
			filter: (
				payload: { notificationReceived: { recipientId: string } },
				_: unknown,
				context: { req?: { user?: { userId: string } } },
			) => payload.notificationReceived.recipientId === context.req?.user?.userId,
		}),
	);
