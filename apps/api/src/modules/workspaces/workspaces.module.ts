import { WorkspaceModel } from "@/models/Workspace.model";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkspacesRepository } from "./workspaces.repository";
import { WorkspacesResolver } from "./workspaces.resolver";
import { WorkspacesService } from "./workspaces.service";

@Module({
	imports: [TypeOrmModule.forFeature([WorkspaceModel])],
	providers: [WorkspacesRepository, WorkspacesResolver, WorkspacesService],
})
export class WorkspacesModule {}
