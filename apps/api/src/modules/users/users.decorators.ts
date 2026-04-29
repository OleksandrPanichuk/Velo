import { UserModel } from "@/models/User.model";
import { applyDecorators } from "@nestjs/common";
import { Query } from "@nestjs/graphql";

export const GetUsersQuery = (): MethodDecorator =>
	applyDecorators(
		Query(() => [UserModel], {
			description: "Retrieve a list of all users. Requires authentication.",
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
