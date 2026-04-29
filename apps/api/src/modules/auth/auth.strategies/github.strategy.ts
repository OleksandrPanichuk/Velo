import type { Env } from "@/config";
import { OAuthProvider } from "@/constants";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import type { Profile } from "passport-github2";
import { Strategy } from "passport-github2";
import { AuthStrategies } from "../auth.constants";
import type { OAuthUserData } from "../auth.typedefs";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, AuthStrategies.GITHUB) {
	constructor(config: ConfigService<Env>) {
		super({
			clientID: config.getOrThrow<string>("GITHUB_CLIENT_ID"),
			clientSecret: config.getOrThrow<string>("GITHUB_CLIENT_SECRET"),
			callbackURL: config.getOrThrow<string>("GITHUB_CALLBACK_URL"),
			scope: ["user:email"],
		});
	}

	public validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
	): OAuthUserData {
		const primaryEmail =
			profile.emails?.[0]?.value ?? `${profile.id}@users.noreply.github.com`;

		return {
			provider: OAuthProvider.GITHUB,
			providerId: profile.id,
			email: primaryEmail,
			fullName: profile.displayName || profile.username || primaryEmail.split("@")[0] as string,
			avatarUrl: profile.photos?.[0]?.value,
			accessToken,
			oauthRefreshToken: refreshToken ?? undefined,
		};
	}
}
