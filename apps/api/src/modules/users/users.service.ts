import { UserModel } from "@/models/User.model";
import { UsersRepository } from "@/modules/users/users.repository";
import { IPaginatedType, PaginationArgs, PaginationService } from "@/shared/pagination";
import { Injectable } from "@nestjs/common";
import { DeepPartial } from "typeorm";

@Injectable()
export class UsersService {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly paginationService: PaginationService,
	) {}

	public async findAll(): Promise<UserModel[]> {
		return this.usersRepository.findAll();
	}

	public async findById(id: string): Promise<UserModel | null> {
		return this.usersRepository.findById(id);
	}

	public async findByIds(ids: readonly string[]): Promise<UserModel[]> {
		return this.usersRepository.findByIds(ids);
	}

	public async findByEmail(email: string): Promise<UserModel | null> {
		return this.usersRepository.findByEmail(email);
	}

	public async findByEmailInsensitive(email: string): Promise<UserModel | null> {
		return this.usersRepository.findByEmailInsensitive(email);
	}

	public async findAllPaginated(
		paginationArgs: PaginationArgs,
	): Promise<IPaginatedType<UserModel>> {
		const qb = await this.usersRepository.createQueryBuilder("user");
		return this.paginationService.paginate(qb, paginationArgs);
	}

	public async update(id: string, data: DeepPartial<UserModel>): Promise<UserModel | null> {
		return this.usersRepository.update(id, data);
	}
}
