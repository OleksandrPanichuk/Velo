import { Field, ObjectType } from "@nestjs/graphql";
import { hash } from "argon2";
import { EmailAddressResolver } from "graphql-scalars";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";
import { BaseModel } from "./Base.model";
import { OAuthAccountModel } from "./OAuthAccount.model";

@ObjectType()
@Entity("users")
export class UserModel extends BaseModel {
	@Field(() => EmailAddressResolver)
	@Column({ unique: true, length: 150 })
	email!: string;

	@Field()
	@Column({ length: 35, unique: true })
	username!: string;

	@Field()
	@Column({ length: 100 })
	fullName!: string;

	@Field({ nullable: true })
	@Column({ type: "varchar", nullable: true })
	avatarUrl!: string | null;

	@Field()
	@Column({ length: 50, default: "UTC" })
	timezone!: string;

	@Field()
	@Column({ length: 10, default: "en" })
	locale!: string;

	@Field()
	@Column({ default: false })
	isEmailVerified!: boolean;

	@Column({ type: "varchar", nullable: true, select: false })
	password!: string | null;

	@Column({ type: "varchar", nullable: true, select: false })
	refreshToken!: string | null;

	@Field(() => [OAuthAccountModel])
	@OneToMany(() => OAuthAccountModel, (account) => account.user)
	oauthAccounts!: OAuthAccountModel[];

	@BeforeInsert()
	@BeforeUpdate()
	private async hashPassword() {
		if (this.password) {
			this.password = await hash(this.password);
		}
	}

	@BeforeInsert()
	@BeforeUpdate()
	private async hashRefreshToken() {
		if (this.refreshToken) {
			this.refreshToken = await hash(this.refreshToken);
		}
	}
}
