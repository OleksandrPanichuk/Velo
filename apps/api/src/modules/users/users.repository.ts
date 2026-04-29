import { OAuthAccountModel } from "@/models/OAuthAccount.model";
import { UserModel } from "@/models/User.model";
import type { OAuthUserData } from "@/modules/auth/auth.typedefs";
import { BaseRepository } from "@/shared/repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
		const user = await this.findById(id);
		if (!user) return;
		user.refreshToken = rawToken;
		await this.repo.save(user);
	}

	public async clearRefreshToken(id: string): Promise<void> {
		await this.repo.update(id, { refreshToken: null });
	}

	// ── OAuth ────────────────────────────────────────────────────────────────

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
		const base = email.split("@")[0]!.replace(/[^a-z0-9_]/gi, "").slice(0, 28).toLowerCase();
		let candidate = base;
		let suffix = 1;

		while (await this.repo.findOne({ where: { username: candidate } })) {
			candidate = `${base}${suffix++}`;
		}

		return candidate;
	}
}
