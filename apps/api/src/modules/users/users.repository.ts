import { OAuthAccountModel } from "@/models/OAuthAccount.model";
import { UserModel } from "@/models/User.model";
import type { OAuthUserData } from "@/modules/auth/auth.typedefs";
import { BaseRepository } from "@/shared/repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { hash } from "argon2";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class UsersRepository extends BaseRepository<UserModel> {
	constructor(
		@InjectRepository(UserModel) repo: Repository<UserModel>,
		@InjectRepository(OAuthAccountModel)
		private readonly oauthRepo: Repository<OAuthAccountModel>,
		private readonly dataSource: DataSource,
	) {
		super(repo);
	}

	public async findByEmail(email: string): Promise<UserModel | null> {
		return this.repo.findOne({ where: { email } });
	}

	public async findByEmailVerificationToken(token: string): Promise<UserModel | null> {
		return this.repo
			.createQueryBuilder("user")
			.addSelect("user.emailVerificationToken")
			.where("user.emailVerificationToken = :token", { token })
			.getOne();
	}

	public async verifyEmail(userId: string): Promise<void> {
		await this.repo.update(userId, { isEmailVerified: true, emailVerificationToken: null });
	}

	public async findByEmailWithPassword(email: string): Promise<UserModel | null> {
		return this.repo
			.createQueryBuilder("user")
			.addSelect("user.password")
			.where("user.email = :email", { email })
			.getOne();
	}

	public async findByIdWithRefreshToken(id: string): Promise<UserModel | null> {
		return this.repo
			.createQueryBuilder("user")
			.addSelect("user.refreshToken")
			.where("user.id = :id", { id })
			.getOne();
	}

	public async setRefreshToken(id: string, rawToken: string): Promise<void> {
		await this.repo.update(id, { refreshToken: await hash(rawToken) });
	}

	public async clearRefreshToken(id: string): Promise<void> {
		await this.repo.update(id, { refreshToken: null });
	}

	public async findByPasswordResetToken(token: string): Promise<UserModel | null> {
		return this.repo
			.createQueryBuilder("user")
			.addSelect("user.passwordResetToken")
			.addSelect("user.passwordResetTokenExpiresAt")
			.where("user.passwordResetToken = :token", { token })
			.getOne();
	}

	public async setPasswordResetToken(id: string, token: string, expiresAt: Date): Promise<void> {
		await this.repo.update(id, {
			passwordResetToken: token,
			passwordResetTokenExpiresAt: expiresAt,
		});
	}

	public async clearPasswordResetToken(id: string): Promise<void> {
		await this.repo.update(id, { passwordResetToken: null, passwordResetTokenExpiresAt: null });
	}

	public async updatePassword(id: string, password: string): Promise<void> {
		await this.repo.update(id, { password: await hash(password) });
	}

	public async findOAuthAccount(
		provider: string,
		providerId: string,
	): Promise<OAuthAccountModel | null> {
		return this.oauthRepo.findOne({
			where: { provider: provider as OAuthAccountModel["provider"], providerId },
			relations: { user: true },
		});
	}

	public async createUserWithOAuth(data: OAuthUserData): Promise<UserModel> {
		return this.dataSource.transaction(async (manager) => {
			const user = manager.create(UserModel, {
				email: data.email,
				fullName: data.fullName,
				avatarUrl: data.avatarUrl ?? null,
				username: await this.generateUsername(data.email),
				isEmailVerified: true,
				password: null,
			});
			await manager.save(user);

			const oauthAccount = manager.create(OAuthAccountModel, {
				userId: user.id,
				provider: data.provider,
				providerId: data.providerId,
				accessToken: data.accessToken,
				oauthRefreshToken: data.oauthRefreshToken ?? null,
			});
			await manager.save(oauthAccount);

			return user;
		});
	}

	public async linkOAuthAccount(userId: string, data: OAuthUserData): Promise<OAuthAccountModel> {
		const account = this.oauthRepo.create({
			userId,
			provider: data.provider,
			providerId: data.providerId,
			accessToken: data.accessToken,
			oauthRefreshToken: data.oauthRefreshToken ?? null,
		});
		return this.oauthRepo.save(account);
	}

	private async generateUsername(email: string): Promise<string> {
		const base = email
			.split("@")[0]!
			.replace(/[^a-z0-9_]/gi, "")
			.slice(0, 28)
			.toLowerCase();

		const rows = await this.repo
			.createQueryBuilder("user")
			.select("user.username")
			.where("user.username LIKE :prefix", { prefix: `${base}%` })
			.getMany();

		const taken = new Set(rows.map((u) => u.username));
		if (!taken.has(base)) return base;

		let suffix = 1;
		while (taken.has(`${base}${suffix}`)) suffix++;
		return `${base}${suffix}`;
	}
}
