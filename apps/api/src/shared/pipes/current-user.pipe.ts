import { UsersService } from "@/modules/users/users.service";
import { Injectable, UnauthorizedException, type PipeTransform } from "@nestjs/common";

export interface CurrentUserPipeInput {
	userId: string;
	key: string | undefined;
}

@Injectable()
export class CurrentUserPipe implements PipeTransform<CurrentUserPipeInput, Promise<unknown>> {
	constructor(private readonly usersService: UsersService) {}

	public async transform({ userId, key }: CurrentUserPipeInput): Promise<unknown> {
		const user = await this.usersService.findById(userId);
		if (!user) throw new UnauthorizedException();
		if (key !== undefined) return user[key as keyof typeof user];
		return user;
	}
}

export interface OptionalCurrentUserPipeInput {
	userId: string | null;
	key: string | undefined;
}

@Injectable()
export class OptionalCurrentUserPipe implements PipeTransform<OptionalCurrentUserPipeInput, Promise<unknown>> {
	constructor(private readonly usersService: UsersService) {}

	public async transform({ userId, key }: OptionalCurrentUserPipeInput): Promise<unknown> {
		if (!userId) return null;
		const user = await this.usersService.findById(userId);
		if (!user) return null;
		if (key !== undefined) return user[key as keyof typeof user];
		return user;
	}
}
