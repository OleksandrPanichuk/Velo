import {Args, ObjectType, Query, Resolver} from "@nestjs/graphql";
import DataLoader from "dataloader";
import {Loader} from "@/infrastructure/dataloader";
import {UserModel} from "@/models/User.model";
import {Paginated, PaginationArgs} from "@/shared/pagination";
import {UsersLoader} from "./users.loader";
import {UsersService} from "./users.service";

@ObjectType()
class PaginatedUsersResult extends (Paginated(UserModel) as ReturnType<typeof Paginated<UserModel>>) {}

@Resolver(() => UserModel)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {
    }

    @Query(() => [UserModel])
    async getUsers() {
        return this.usersService.findAll();
    }

    @Query(() => PaginatedUsersResult)
    async getUsersPaginated(@Args("pagination") paginationArgs: PaginationArgs) {
        return this.usersService.findAllPaginated(paginationArgs);
    }

    @Query(() => UserModel, {nullable: true})
    async getUserById(
        @Args("id") id: string,
        @Loader(UsersLoader) usersLoader: DataLoader<string, UserModel>,
    ) {
        return usersLoader.load(id);
    }
}
