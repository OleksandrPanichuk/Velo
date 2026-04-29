import { UserModel } from "@/models/User.model";
import { UsersRepository } from "@/modules/users/users.repository";
import { IPaginatedType, PaginationArgs, PaginationService } from "@/shared/pagination";
import { Injectable } from "@nestjs/common";

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

	public async findAllPaginated(
		paginationArgs: PaginationArgs,
	): Promise<IPaginatedType<UserModel>> {
		const qb = await this.usersRepository.createQueryBuilder("user");
		return this.paginationService.paginate(qb, paginationArgs);
	}
}
