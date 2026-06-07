import { NotificationModel } from "@/models/Notification.model";
import { WorkspaceMembersModule } from "@/modules/workspace-members/workspace-members.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationsListener } from "./notifications.listener";
import { NotificationsRepository } from "./notifications.repository";
import { NotificationsResolver } from "./notifications.resolver";
import { NotificationsService } from "./notifications.service";

@Module({
	imports: [TypeOrmModule.forFeature([NotificationModel]), WorkspaceMembersModule],
	providers: [
		NotificationsListener,
		NotificationsRepository,
		NotificationsResolver,
		NotificationsService,
	],
})
export class NotificationsModule {}
