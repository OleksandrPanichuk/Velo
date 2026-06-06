import { NotificationModel } from "@/models/Notification.model";
import { BaseRepository } from "@/shared/repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class NotificationsRepository extends BaseRepository<NotificationModel> {
	constructor(@InjectRepository(NotificationModel) repo: Repository<NotificationModel>) {
		super(repo);
	}

	public async findByRecipientId(
		recipientId: string,
		workspaceId: string,
	): Promise<NotificationModel[]> {
		return this.repo.find({
			where: {
				recipientId,
				workspaceId,
			},
		});
	}

	public async countUnread(recipientId: string, workspaceId: string): Promise<number> {
		return this.repo.count({
			where: {
				recipientId,
				workspaceId,
			},
		});
	}

	public async markAsRead(id: string, recipientId: string): Promise<void> {
		await this.repo.update(
			{
				recipientId,
				id,
			},
			{
				isRead: true,
			},
		);
	}

	public async markAllAsRead(recipientId: string, workspaceId: string): Promise<void> {
		await this.repo.update({ recipientId, workspaceId, isRead: false }, { isRead: true });
	}
}
