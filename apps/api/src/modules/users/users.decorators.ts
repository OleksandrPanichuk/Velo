import { UserModel } from "@/models/User.model";
import { Paginated } from "@/shared/pagination";
import { applyDecorators } from "@nestjs/common";
import { ObjectType, Query } from "@nestjs/graphql";

@ObjectType()
export class UserPaginatedModel extends Paginated(UserModel) {}

export const GetUsersQuery = (): MethodDecorator =>
	applyDecorators(
		Query(() => UserPaginatedModel, {
			description: "Retrieve a paginated list of users. Requires authentication.",
		}),
	);

export const GetUserByIdQuery = (): MethodDecorator =>
	applyDecorators(
		Query(() => UserModel, {
			nullable: true,
			description:
				"Retrieve a specific user by his id. Requires authentication and necessary roles.",
		}),
	);

export const GetCurrentUserQuery = (): MethodDecorator =>
	applyDecorators(
		Query(() => UserModel, {
			nullable: true,
			description: "Retrieve the current user. Requires authentication.",
		}),
	);
