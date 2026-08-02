import { WorkspaceInviteRole } from "@/enums/WorkspaceInviteRole.enum";
import { Field, ObjectType } from "@nestjs/graphql";
import { DateTimeResolver, EmailAddressResolver } from "graphql-scalars";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseModel } from "./Base.model";
import { WorkspaceMemberModel } from "./WorkspaceMember.model";

@ObjectType()
@Entity("workspace_invites")
@Index(["workspaceId"])
@Index("UQ_workspace_invites_pending_email", { synchronize: false })
export class WorkspaceInviteModel extends BaseModel {
	@Column({ type: "uuid" })
	workspaceId!: string;

	@Field(() => EmailAddressResolver)
	@Column({ type: "varchar", length: 100 })
	email!: string;

	@Field(() => WorkspaceInviteRole)
	@Column({ type: "enum", enum: WorkspaceInviteRole, default: WorkspaceInviteRole.MEMBER })
	role!: WorkspaceInviteRole;

	/** Deliberately not a GraphQL field: the token must only ever leave over email. */
	@Column({ type: "varchar", length: 255, unique: true })
	token!: string;

	@Field(() => DateTimeResolver)
	@Column({ type: "timestamp" })
	expiresAt!: Date;

	@Field(() => DateTimeResolver, { nullable: true })
	@Column({ type: "timestamp", nullable: true })
	acceptedAt!: Date | null;

	@Column({ type: "uuid" })
	inviterId!: string;

	@Field(() => WorkspaceMemberModel)
	@ManyToOne(() => WorkspaceMemberModel, { onDelete: "CASCADE" })
	@JoinColumn({ name: "inviterId" })
	inviter!: WorkspaceMemberModel;
}
