import type { Env } from "@/config";
import { OAuthProvider } from "@/constants";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import type { Profile } from "passport-google-oauth20";
import { Strategy } from "passport-google-oauth20";
import { AuthStrategies } from "../auth.constants";
import type { OAuthUserData } from "../auth.typedefs";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, AuthStrategies.GOOGLE) {
	constructor(config: ConfigService<Env>) {
		super({
			clientID: config.getOrThrow<string>("GOOGLE_CLIENT_ID"),
			clientSecret: config.getOrThrow<string>("GOOGLE_CLIENT_SECRET"),
			callbackURL: config.getOrThrow<string>("GOOGLE_CALLBACK_URL"),
			scope: ["email", "profile"],
		});
	}

	public validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
	): OAuthUserData {
		return {
			provider: OAuthProvider.GOOGLE,
			providerId: profile.id,
			email: profile.emails?.[0]?.value as string,
			fullName: profile.displayName,
			avatarUrl: profile.photos?.[0]?.value,
			accessToken,
			oauthRefreshToken: refreshToken ?? undefined,
		};
	}
}
