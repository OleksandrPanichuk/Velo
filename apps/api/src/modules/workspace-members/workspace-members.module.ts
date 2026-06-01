import { Module } from "@nestjs/common";
import { WorkspaceMembersRepository } from "./workspace-members.repository";
import { WorkspaceMembersService } from "./workspace-members.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkspaceMemberModel } from "@/models/WorkspaceMember.model";

@Module({
	imports: [TypeOrmModule.forFeature([WorkspaceMemberModel])],
	providers: [WorkspaceMembersRepository, WorkspaceMembersService],
	exports: [WorkspaceMembersService],
})
export class WorkspaceMembersModule {}
