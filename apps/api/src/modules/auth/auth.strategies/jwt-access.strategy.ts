import type { Env } from "@/config";
import { CookieNames } from "@/constants";
import { AppClsService } from "@/infrastructure/cls/cls.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { AuthStrategies } from "../auth.constants";
import type { JwtPayload } from "../auth.typedefs";
import { extractFromCookie } from "../auth.utils";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, AuthStrategies.JWT_ACCESS) {
	constructor(
		private readonly config: ConfigService<Env>,
		private readonly cls: AppClsService,
	) {
		super({
			jwtFromRequest: extractFromCookie(CookieNames.ACCESS_TOKEN),
			secretOrKey: config.getOrThrow<string>("JWT_ACCESS_SECRET"),
			ignoreExpiration: false,
		});
	}

	public validate(payload: JwtPayload): { userId: string } {
		if (!payload.sub) {
			throw new UnauthorizedException();
		}

		this.cls.setUserId(payload.sub);

		return { userId: payload.sub };
	}
}
