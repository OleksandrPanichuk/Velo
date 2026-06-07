import { NotificationModel } from "@/models/Notification.model";
import { NotificationType } from "@/enums";
import { BaseRepository } from "@/shared/repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export interface CreateNotificationData {
	recipientId: string;
	workspaceId: string;
	actorId: string | null;
	type: NotificationType;
	title: string;
	body?: string;
}

@Injectable()
export class NotificationsRepository extends BaseRepository<NotificationModel> {
	constructor(@InjectRepository(NotificationModel) repo: Repository<NotificationModel>) {
		super(repo);
	}

	public async findByRecipientAndWorkspace(
		recipientId: string,
		workspaceId: string,
	): Promise<NotificationModel[]> {
		return this.em.find(this.repo.target, {
			where: { recipientId, workspaceId },
			order: { createdAt: "DESC" },
		});
	}

	public async countUnread(recipientId: string, workspaceId: string): Promise<number> {
		return this.em.count(this.repo.target, {
			where: { recipientId, workspaceId, isRead: false },
		});
	}

	public async markAsRead(id: string, recipientId: string): Promise<NotificationModel | null> {
		const notification = await this.em.findOne(this.repo.target, {
			where: { id, recipientId },
		});
		if (!notification) return null;
		notification.isRead = true;
		return this.em.save(notification);
	}

	public async markAllAsRead(recipientId: string, workspaceId: string): Promise<void> {
		await this.em.update(this.repo.target, { recipientId, workspaceId, isRead: false }, { isRead: true });
	}
}
