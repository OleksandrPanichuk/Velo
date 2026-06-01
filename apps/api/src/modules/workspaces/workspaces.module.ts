import { WorkspaceModel } from "@/models/Workspace.model";
import { WorkspaceMembersModule } from "@/modules/workspace-members/workspace-members.module";
import { UsersModule } from "@/modules/users/users.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkspacesRepository } from "./workspaces.repository";
import { WorkspacesResolver } from "./workspaces.resolver";
import { WorkspacesService } from "./workspaces.service";

@Module({
	imports: [TypeOrmModule.forFeature([WorkspaceModel]), WorkspaceMembersModule, UsersModule],
	providers: [WorkspacesRepository, WorkspacesResolver, WorkspacesService],
})
export class WorkspacesModule {}
