import { Loader } from "@/infrastructure/dataloader";
import { UserModel } from "@/models/User.model";
import { OptionalCurrentUser, Public } from "@/shared/decorators";
import { AppAuthGuard } from "@/shared/guards";
import { IPaginatedType, PaginationArgs } from "@/shared/pagination";
import { UseGuards } from "@nestjs/common";
import { Args, Resolver } from "@nestjs/graphql";
import DataLoader from "dataloader";
import { GetCurrentUserQuery, GetUserByIdQuery, GetUsersQuery } from "./users.decorators";
import { UsersLoader } from "./users.loader";
import { UsersService } from "./users.service";

@UseGuards(AppAuthGuard)
@Resolver(() => UserModel)
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	@GetUsersQuery()
	public async getUsers(
		@Args() paginationArgs: PaginationArgs,
	): Promise<IPaginatedType<UserModel>> {
		return this.usersService.findAllPaginated(paginationArgs);
	}

	// TODO: add roles and permissions checks
	@GetUserByIdQuery()
	public async getUserById(
		@Args("id") id: string,
		@Loader(UsersLoader) usersLoader: DataLoader<string, UserModel>,
	): Promise<UserModel | null> {
		return usersLoader.load(id);
	}

	@Public()
	@GetCurrentUserQuery()
	public getCurrentUser(@OptionalCurrentUser() user: UserModel | null): UserModel | null {
		return user;
	}
}
