import type { Env } from "@/config";
import { CookieNames } from "@/constants";
import { AppClsService } from "@/infrastructure/cls/cls.service";
import { UsersRepository } from "@/modules/users/users.repository";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import argon2 from "argon2";
import type { Request } from "express";
import { Strategy } from "passport-jwt";
import { AuthStrategies } from "../auth.constants";
import type { JwtPayload } from "../auth.typedefs";
import { extractFromCookie } from "../auth.utils";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, AuthStrategies.JWT_REFRESH) {
	constructor(
		private readonly config: ConfigService<Env>,
		private readonly cls: AppClsService,
		private readonly usersRepository: UsersRepository,
	) {
		super({
			jwtFromRequest: extractFromCookie(CookieNames.REFRESH_TOKEN),
			secretOrKey: config.getOrThrow<string>("JWT_REFRESH_SECRET"),
			passReqToCallback: true,
			ignoreExpiration: false,
		});
	}

	public async validate(req: Request, payload: JwtPayload): Promise<{ userId: string }> {
		const rawToken = req.cookies[CookieNames.REFRESH_TOKEN] as string | undefined;

		if (!rawToken || !payload.sub) {
			throw new UnauthorizedException();
		}

		const user = await this.usersRepository.findByIdWithRefreshToken(payload.sub);

		if (!user?.refreshToken) {
			throw new UnauthorizedException();
		}

		const isValid = await argon2.verify(user.refreshToken, rawToken);

		if (!isValid) {
			throw new UnauthorizedException();
		}

		this.cls.setUserId(user.id);

		return { userId: user.id };
	}
}
