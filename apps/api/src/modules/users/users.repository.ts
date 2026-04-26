import { UserModel } from "@/models/User.model";
import { BaseRepository } from "@/shared/repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UsersRepository extends BaseRepository<UserModel> {
	constructor(@InjectRepository(UserModel) repo: Repository<UserModel>) {
		super(repo);
	}
}
