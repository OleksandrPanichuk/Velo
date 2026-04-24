import { mapToOrderedArray, type NestDataLoader } from "@/infrastructure/dataloader";
import { UserModel } from "@/models/User.model";
import { UsersService } from "@/modules/users/users.service";
import { Injectable } from "@nestjs/common";
import DataLoader from "dataloader";

@Injectable()
export class UsersLoader implements NestDataLoader<string, UserModel> {
	constructor(private readonly usersService: UsersService) {}

	public generateDataLoader(): DataLoader<string, UserModel | null> {
		return new DataLoader<string, UserModel | null>(
			async (userIds: readonly string[]) => {
				const users = await this.usersService.findByIds(userIds);
				return mapToOrderedArray<string, UserModel>(users, userIds, (user) => user.id);
			},
			{
				cache: true,
			},
		);
	}
}
