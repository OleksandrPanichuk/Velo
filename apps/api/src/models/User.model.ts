import { Field, ObjectType } from "@nestjs/graphql";
import { hash } from "argon2";
import { EmailAddressResolver } from "graphql-scalars";
import { BeforeInsert, Column, Entity, OneToMany, type Relation } from "typeorm";
import { BaseModelWithDeletedAt } from "./Base.model";
import { OAuthAccountModel } from "./OAuthAccount.model";
import { WorkspaceMemberModel } from "./WorkspaceMember.model";
import { TeamMemberModel } from "./TeamMember.model";

@ObjectType()
@Entity("users")
export class UserModel extends BaseModelWithDeletedAt {
	@Field(() => EmailAddressResolver)
	@Column({ unique: true, length: 150 })
	email!: string;

	@Field()
	@Column({ length: 35, unique: true })
	username!: string;

	@Field()
	@Column({ length: 100 })
	fullName!: string;

	@Field(() => String, { nullable: true })
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

	@Column({ type: "varchar", nullable: true, select: false })
	emailVerificationToken!: string | null;

	@Column({ type: "varchar", nullable: true, select: false })
	passwordResetToken!: string | null;

	@Column({ type: "timestamptz", nullable: true })
	passwordResetTokenExpiresAt!: Date | null;

	@Field(() => [OAuthAccountModel])
	@OneToMany(() => OAuthAccountModel, (account) => account.user)
	oauthAccounts!: Relation<OAuthAccountModel[]>;

	@Field(() => [WorkspaceMemberModel])
	@OneToMany(() => WorkspaceMemberModel, (m) => m.user)
	workspaceMembers!: Relation<WorkspaceMemberModel[]>;

	@Field(() => [TeamMemberModel])
	@OneToMany(() => TeamMemberModel, (m) => m.user)
	teamMembers!: Relation<TeamMemberModel[]>

	@BeforeInsert()
	private async hashPassword() {
		if (this.password) {
			this.password = await hash(this.password);
		}
	}

	@BeforeInsert()
	private async hashRefreshToken() {
		if (this.refreshToken) {
			this.refreshToken = await hash(this.refreshToken);
		}
	}
}
