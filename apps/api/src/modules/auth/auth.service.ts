import type { Env } from "@/config";
import { CookieNames, ErrorMessages } from "@/constants";
import type { UserModel } from "@/models/User.model";
import { UsersRepository } from "@/modules/users/users.repository";
import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { NodeEnv } from "@repo/primitives";
import { verify } from "argon2";
import type { CookieOptions, Response } from "express";
import { ACCESS_TOKEN_TTL_MS, REFRESH_TOKEN_TTL_MS } from "./auth.constants";
import type { SignInInput, SignUpInput } from "./auth.dto";
import type { AuthTokens, OAuthUserData } from "./auth.typedefs";

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly config: ConfigService<Env>,
		private readonly usersRepository: UsersRepository,
	) {}

	public async signUp(dto: SignUpInput, res: Response): Promise<UserModel> {
		const existing = await this.usersRepository.findByEmail(dto.email);
		if (existing) throw new ConflictException(ErrorMessages.AUTH.EMAIL_IN_USE);

		const user = await this.usersRepository.create({
			email: dto.email,
			username: dto.username,
			fullName: dto.fullName,
			password: dto.password,
		});

		const tokens = await this.generateTokens(user.id);
		await this.usersRepository.setRefreshToken(user.id, tokens.refreshToken);
		this.setTokenCookies(res, tokens);

		return user;
	}

	public async signIn(dto: SignInInput, res: Response): Promise<UserModel> {
		const user = await this.usersRepository.findByEmailWithPassword(dto.email);
		if (!user) throw new UnauthorizedException(ErrorMessages.AUTH.INVALID_CREDENTIALS);

		if (!user.password) {
			throw new UnauthorizedException(ErrorMessages.AUTH.PASSWORD_NOT_SET);
		}

		const isPasswordValid = await verify(user.password, dto.password);
		if (!isPasswordValid) throw new UnauthorizedException(ErrorMessages.AUTH.INVALID_CREDENTIALS);

		const tokens = await this.generateTokens(user.id);
		await this.usersRepository.setRefreshToken(user.id, tokens.refreshToken);
		this.setTokenCookies(res, tokens);

		return user;
	}

	public async refresh(userId: string, res: Response): Promise<UserModel> {
		const user = await this.usersRepository.findById(userId);
		if (!user) throw new UnauthorizedException(ErrorMessages.AUTH.UNAUTHORIZED);

		const tokens = await this.generateTokens(user.id);
		await this.usersRepository.setRefreshToken(user.id, tokens.refreshToken);
		this.setTokenCookies(res, tokens);

		return user;
	}

	public async signOut(userId: string, res: Response): Promise<void> {
		await this.usersRepository.clearRefreshToken(userId);
		this.clearTokenCookies(res);
	}

	public async oauthSignIn(data: OAuthUserData, res: Response): Promise<UserModel> {
		const existing = await this.usersRepository.findOAuthAccount(data.provider, data.providerId);

		let user: UserModel;

		if (existing) {
			user = existing.user;
		} else {
			const userByEmail = await this.usersRepository.findByEmail(data.email);

			if (userByEmail) {
				await this.usersRepository.linkOAuthAccount(userByEmail.id, data);
				user = userByEmail;
			} else {
				user = await this.usersRepository.createUserWithOAuth(data);
			}
		}

		const tokens = await this.generateTokens(user.id);
		await this.usersRepository.setRefreshToken(user.id, tokens.refreshToken);
		this.setTokenCookies(res, tokens);

		return user;
	}

	private async generateTokens(userId: string): Promise<AuthTokens> {
		const payload = { sub: userId };
		const accessSecret = this.config.getOrThrow<string>("JWT_ACCESS_SECRET");
		const refreshSecret = this.config.getOrThrow<string>("JWT_REFRESH_SECRET");

		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(payload, {
				secret: accessSecret,
				expiresIn: ACCESS_TOKEN_TTL_MS / 1000,
			}),
			this.jwtService.signAsync(payload, {
				secret: refreshSecret,
				expiresIn: REFRESH_TOKEN_TTL_MS / 1000,
			}),
		]);

		return { accessToken, refreshToken };
	}

	private setTokenCookies(res: Response, tokens: AuthTokens): void {
		const base = this.baseCookieOptions();
		res.cookie(CookieNames.ACCESS_TOKEN, tokens.accessToken, {
			...base,
			maxAge: ACCESS_TOKEN_TTL_MS,
		});
		res.cookie(CookieNames.REFRESH_TOKEN, tokens.refreshToken, {
			...base,
			maxAge: REFRESH_TOKEN_TTL_MS,
		});
	}

	private clearTokenCookies(res: Response): void {
		const base = this.baseCookieOptions();
		res.clearCookie(CookieNames.ACCESS_TOKEN, base);
		res.clearCookie(CookieNames.REFRESH_TOKEN, base);
	}

	private baseCookieOptions(): CookieOptions {
		const isProduction = this.config.get<string>("NODE_ENV") === NodeEnv.PRODUCTION;
		return { httpOnly: true, secure: isProduction, sameSite: "lax" };
	}
}
