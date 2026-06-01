import { WorkspaceMemberModel } from "@/models/WorkspaceMember.model";
import { BaseRepository } from "@/shared/repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class WorkspaceMembersRepository extends BaseRepository<WorkspaceMemberModel> {
	constructor(@InjectRepository(WorkspaceMemberModel) repo: Repository<WorkspaceMemberModel>) {
		super(repo);
	}
}
