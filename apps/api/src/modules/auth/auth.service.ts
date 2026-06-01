import { randomBytes } from "node:crypto";

import type { Env } from "@/config";
import { CookieNames, ErrorMessages } from "@/constants";
import { AppClsService } from "@/infrastructure/cls";
import type { UserModel } from "@/models/User.model";
import { UsersRepository } from "@/modules/users/users.repository";
import { MailQueue } from "@/queues/mail";
import {
	BadRequestException,
	ConflictException,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { NodeEnv } from "@repo/primitives";
import { verify } from "argon2";
import { serialize, type SerializeOptions } from "cookie";
import { ACCESS_TOKEN_TTL_MS, PASSWORD_RESET_TTL_MS, REFRESH_TOKEN_TTL_MS } from "./auth.constants";
import type { ForgotPasswordInput, ResetPasswordInput, SignInInput, SignUpInput } from "./auth.dto";
import type { AuthTokens, OAuthUserData } from "./auth.typedefs";

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);
	private readonly accessSecret: string;
	private readonly refreshSecret: string;

	constructor(
		private readonly jwtService: JwtService,
		private readonly config: ConfigService<Env>,
		private readonly usersRepository: UsersRepository,
		private readonly mailQueue: MailQueue,
		private readonly cls: AppClsService,
	) {
		this.accessSecret = config.getOrThrow<string>("JWT_ACCESS_SECRET");
		this.refreshSecret = config.getOrThrow<string>("JWT_REFRESH_SECRET");
	}

	public async signUp(dto: SignUpInput): Promise<UserModel> {
		const existing = await this.usersRepository.findByEmail(dto.email);
		if (existing) throw new ConflictException(ErrorMessages.AUTH.EMAIL_IN_USE);

		const emailVerificationToken = randomBytes(32).toString("hex");

		const user = await this.usersRepository.create({
			email: dto.email,
			username: dto.username,
			fullName: dto.fullName,
			password: dto.password,
			emailVerificationToken,
		});

		const tokens = await this.generateTokens(user.id);
		await this.usersRepository.setRefreshToken(user.id, tokens.refreshToken);
		this.setTokenCookies(tokens);

		const verificationUrl = `${this.config.getOrThrow<string>("CLIENT_EMAIL_VERIFICATION_URL")}?token=${emailVerificationToken}`;

		await this.mailQueue.enqueueEmailVerification(user.email, {
			verificationUrl,
			expiresIn: "7 days",
		});

		return user;
	}

	public async signIn(dto: SignInInput): Promise<UserModel> {
		const user = await this.usersRepository.findByEmailWithPassword(dto.email);

		if (!user) throw new UnauthorizedException(ErrorMessages.AUTH.INVALID_CREDENTIALS);

		if (!user.password) {
			throw new UnauthorizedException(ErrorMessages.AUTH.PASSWORD_NOT_SET);
		}

		const isPasswordValid = await verify(user.password, dto.password);

		if (!isPasswordValid) throw new UnauthorizedException(ErrorMessages.AUTH.INVALID_CREDENTIALS);

		const tokens = await this.generateTokens(user.id);
		await this.usersRepository.setRefreshToken(user.id, tokens.refreshToken);
		this.setTokenCookies(tokens);

		return user;
	}

	public async refresh(userId: string): Promise<UserModel> {
		const user = await this.usersRepository.findById(userId);
		if (!user) throw new UnauthorizedException(ErrorMessages.AUTH.UNAUTHORIZED);

		const tokens = await this.generateTokens(user.id);
		await this.usersRepository.setRefreshToken(user.id, tokens.refreshToken);
		this.setTokenCookies(tokens);

		return user;
	}

	public async signOut(userId: string): Promise<void> {
		await this.usersRepository.clearRefreshToken(userId);
		this.clearTokenCookies();
	}

	public async verifyEmail(token: string): Promise<boolean> {
		const user = await this.usersRepository.findByEmailVerificationToken(token);
		if (!user) throw new UnauthorizedException(ErrorMessages.AUTH.INVALID_VERIFICATION_TOKEN);
		if (user.isEmailVerified)
			throw new ConflictException(ErrorMessages.AUTH.EMAIL_ALREADY_VERIFIED);

		await this.usersRepository.verifyEmail(user.id);
		return true;
	}

	public async forgotPassword(dto: ForgotPasswordInput): Promise<boolean> {
		const user = await this.usersRepository.findByEmail(dto.email);
		this.logger.log({ user, email: dto.email });
		if (!user) return true;

		const token = randomBytes(32).toString("hex");
		const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);

		await this.usersRepository.setPasswordResetToken(user.id, token, expiresAt);

		const resetUrl = `${this.config.getOrThrow<string>("CLIENT_RESET_PASSWORD_URL")}?token=${token}`;
		await this.mailQueue.enqueuePasswordReset(user.email, {
			resetUrl,
			expiresIn: "1 hour",
		});

		return true;
	}

	public async resetPassword(dto: ResetPasswordInput): Promise<boolean> {
		const user = await this.usersRepository.findByPasswordResetToken(dto.token);
		if (!user) throw new BadRequestException(ErrorMessages.AUTH.INVALID_RESET_TOKEN);

		if (!user.passwordResetTokenExpiresAt || user.passwordResetTokenExpiresAt < new Date()) {
			throw new BadRequestException(ErrorMessages.AUTH.INVALID_RESET_TOKEN);
		}

		await this.usersRepository.updatePassword(user.id, dto.password);
		await this.usersRepository.clearPasswordResetToken(user.id);

		return true;
	}

	public async oauthSignIn(data: OAuthUserData): Promise<UserModel> {
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
		this.setTokenCookies(tokens);

		return user;
	}

	private async generateTokens(userId: string): Promise<AuthTokens> {
		const payload = { sub: userId };

		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(payload, {
				secret: this.accessSecret,
				expiresIn: ACCESS_TOKEN_TTL_MS / 1000,
			}),
			this.jwtService.signAsync(payload, {
				secret: this.refreshSecret,
				expiresIn: REFRESH_TOKEN_TTL_MS / 1000,
			}),
		]);

		return { accessToken, refreshToken };
	}

	private setTokenCookies(tokens: AuthTokens): void {
		const res = this.cls.response;
		if (!res) throw new Error("Response not available in CLS context");

		const base = this.baseCookieOptions();

		res.setHeader("Set-Cookie", [
			serialize(CookieNames.ACCESS_TOKEN, tokens.accessToken, {
				...base,
				maxAge: ACCESS_TOKEN_TTL_MS / 1000,
			}),
			serialize(CookieNames.REFRESH_TOKEN, tokens.refreshToken, {
				...base,
				maxAge: REFRESH_TOKEN_TTL_MS / 1000,
			}),
		]);
	}

	private clearTokenCookies(): void {
		const res = this.cls.response;
		if (!res) return;

		res.setHeader("Set-Cookie", [
			serialize(CookieNames.ACCESS_TOKEN, "", { path: "/", expires: new Date(0) }),
			serialize(CookieNames.REFRESH_TOKEN, "", { path: "/", expires: new Date(0) }),
		]);
	}

	private baseCookieOptions(): SerializeOptions {
		const isProduction = this.config.get<string>("NODE_ENV") === NodeEnv.PRODUCTION;

		return { httpOnly: true, secure: isProduction, sameSite: "lax", path: "/" };
	}
}
