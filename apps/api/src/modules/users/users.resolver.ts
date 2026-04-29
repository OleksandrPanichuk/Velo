import { Loader } from "@/infrastructure/dataloader";
import { UserModel } from "@/models/User.model";
import { GqlAuthGuard } from "@/shared/guards";
import { UseGuards } from "@nestjs/common";
import { Args, Resolver } from "@nestjs/graphql";
import DataLoader from "dataloader";
import { GetUserByIdQuery, GetUsersQuery } from "./users.decorators";
import { UsersLoader } from "./users.loader";
import { UsersService } from "./users.service";

@UseGuards(GqlAuthGuard)
@Resolver(() => UserModel)
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	@GetUsersQuery()
	public async getUsers(): Promise<UserModel[]> {
		return this.usersService.findAll();
	}

	// TODO: add roles and permissions checks
	@GetUserByIdQuery()
	public async getUserById(
		@Args("id") id: string,
		@Loader(UsersLoader) usersLoader: DataLoader<string, UserModel>,
	): Promise<UserModel | null> {
		return usersLoader.load(id);
	}
}
