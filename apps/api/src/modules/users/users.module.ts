import { OAuthAccountModel } from "@/models/OAuthAccount.model";
import { UserModel } from "@/models/User.model";
import { UsersLoader } from "@/modules/users/users.loader";
import { UsersRepository } from "@/modules/users/users.repository";
import { UsersResolver } from "@/modules/users/users.resolver";
import { UsersService } from "@/modules/users/users.service";
import { AppAuthGuard } from "@/shared/guards";
import { CurrentUserPipe, OptionalCurrentUserPipe } from "@/shared/pipes";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
	imports: [TypeOrmModule.forFeature([UserModel, OAuthAccountModel])],
	providers: [
		CurrentUserPipe,
		OptionalCurrentUserPipe,
		AppAuthGuard,
		UsersLoader,
		UsersRepository,
		UsersResolver,
		UsersService,
	],
	exports: [UsersLoader, UsersRepository, UsersService],
})
export class UsersModule {}
