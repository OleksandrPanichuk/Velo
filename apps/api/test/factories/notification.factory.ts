import { NotificationType } from "@/enums";
import { NotificationModel } from "@/models/Notification.model";
import { faker } from "@faker-js/faker";

export const NotificationFactory = {
	build(overrides: Partial<NotificationModel> = {}): NotificationModel {
		return {
			id: faker.string.uuid(),
			recipientId: faker.string.uuid(),
			workspaceId: faker.string.uuid(),
			actorId: faker.string.uuid(),
			type: NotificationType.MEMBER_JOINED,
			title: "A new member joined your workspace",
			body: null,
			isRead: false,
			createdAt: faker.date.past(),
			updatedAt: faker.date.recent(),
			recipient: null as never,
			workspace: null as never,
			actor: null,
			...overrides,
		} as NotificationModel;
	},

	buildRead(overrides: Partial<NotificationModel> = {}): NotificationModel {
		return NotificationFactory.build({ isRead: true, ...overrides });
	},

	buildList(count: number, overrides: Partial<NotificationModel> = {}): NotificationModel[] {
		return Array.from({ length: count }, () => NotificationFactory.build(overrides));
	},
};
