import { UsersModule } from "@/modules/users/users.module";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { JwtAccessGuard, JwtRefreshGuard } from "./auth.guards";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import {
	GithubStrategy,
	GoogleStrategy,
	JwtAccessStrategy,
	JwtRefreshStrategy,
} from "./auth.strategies";

@Module({
	imports: [JwtModule.register({}), PassportModule, UsersModule],
	controllers: [AuthController],
	providers: [
		AuthResolver,
		AuthService,
		GithubStrategy,
		GoogleStrategy,
		JwtAccessGuard,
		JwtAccessStrategy,
		JwtRefreshGuard,
		JwtRefreshStrategy,
	],
	exports: [JwtAccessGuard, JwtRefreshGuard],
})
export class AuthModule {}
