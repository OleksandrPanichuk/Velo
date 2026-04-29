import { OAuthProvider } from "@/constants";
import { Field, ObjectType } from "@nestjs/graphql";
import { DateTimeResolver, UUIDResolver } from "graphql-scalars";
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
} from "typeorm";
import { UserModel } from "./User.model";

@ObjectType()
@Entity("oauth_accounts")
@Unique(["provider", "providerId"])
export class OAuthAccountModel {
	@Field(() => UUIDResolver)
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column()
	userId!: string;

	@Field(() => String)
	@Column({ type: "varchar" })
	provider!: OAuthProvider;

	@Field()
	@Column()
	providerId!: string;

	@Column({ select: false })
	accessToken!: string;

	@Column({ type: "varchar", nullable: true, select: false })
	oauthRefreshToken!: string | null;

	@Field(() => DateTimeResolver)
	@CreateDateColumn()
	createdAt!: Date;

	@ManyToOne(() => UserModel, (user) => user.oauthAccounts, { onDelete: "CASCADE" })
	@JoinColumn({ name: "userId" })
	user!: UserModel;
}
