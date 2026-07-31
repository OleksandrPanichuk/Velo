import { WorkspaceInviteModel } from "@/models/WorkspaceInvite.model";
import { UsersModule } from "@/modules/users/users.module";
import { WorkspaceMembersModule } from "@/modules/workspace-members/workspace-members.module";
import { WorkspacesModule } from "@/modules/workspaces/workspaces.module";
import { MailQueueModule } from "@/queues/mail";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkspaceInvitesRepository } from "./workspace-invites.repository";
import { WorkspaceInvitesResolver } from "./workspace-invites.resolver";
import { WorkspaceInvitesService } from "./workspace-invites.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([WorkspaceInviteModel]),
		MailQueueModule,
		UsersModule,
		WorkspaceMembersModule,
		WorkspacesModule,
	],
	providers: [WorkspaceInvitesRepository, WorkspaceInvitesResolver, WorkspaceInvitesService],
	exports: [WorkspaceInvitesService],
})
export class WorkspaceInvitesModule {}
