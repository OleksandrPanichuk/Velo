import type { Env } from "@/config";
import { Public } from "@/shared/decorators";
import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import type { Response } from "express";
import { AuthStrategies } from "./auth.constants";
import { AuthService } from "./auth.service";
import type { OAuthRequest } from "./auth.typedefs";

@Public()
@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly config: ConfigService<Env>,
	) {}

	@Get("google")
	@UseGuards(AuthGuard(AuthStrategies.GOOGLE))
	public googleAuth(): void {}

	@Get("google/callback")
	@UseGuards(AuthGuard(AuthStrategies.GOOGLE))
	public async googleCallback(@Req() req: OAuthRequest, @Res() res: Response): Promise<void> {
		try {
			await this.authService.oauthSignIn(req.user, res);
			res.redirect(this.config.getOrThrow<string>("OAUTH_SUCCESS_REDIRECT"));
		} catch {
			res.redirect(this.config.getOrThrow<string>("OAUTH_FAILURE_REDIRECT"));
		}
	}

	@Get("github")
	@UseGuards(AuthGuard(AuthStrategies.GITHUB))
	public githubAuth(): void {}

	@Get("github/callback")
	@UseGuards(AuthGuard(AuthStrategies.GITHUB))
	public async githubCallback(@Req() req: OAuthRequest, @Res() res: Response): Promise<void> {
		try {
			await this.authService.oauthSignIn(req.user, res);
			res.redirect(this.config.getOrThrow<string>("OAUTH_SUCCESS_REDIRECT"));
		} catch {
			res.redirect(this.config.getOrThrow<string>("OAUTH_FAILURE_REDIRECT"));
		}
	}
}
