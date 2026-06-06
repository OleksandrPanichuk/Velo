import { NotificationType } from "@/enums";
import { Field, ObjectType } from "@nestjs/graphql";
import { UUIDResolver } from "graphql-scalars";
import { Column, Entity, JoinColumn, ManyToOne, type Relation } from "typeorm";
import { BaseModel } from "./Base.model";
import { UserModel } from "./User.model";
import { WorkspaceModel } from "./Workspace.model";

@ObjectType()
@Entity("notifications")
export class NotificationModel extends BaseModel {
	@Column({ type: "uuid" })
	recipientId!: string;

	@Field(() => UUIDResolver)
	@Column({ type: "uuid" })
	workspaceId!: string;

	@Column({ type: "uuid", nullable: true })
	actorId!: string | null;

	@Field(() => NotificationType)
	@Column({ type: "enum", enum: NotificationType })
	type!: NotificationType;

	@Field()
	@Column({ length: 255 })
	title!: string;

	@Field(() => String, { nullable: true })
	@Column({ type: "text", nullable: true })
	body!: string | null;

	@Field()
	@Column({ default: false })
	isRead!: boolean;

	@ManyToOne(() => UserModel, { onDelete: "CASCADE" })
	@JoinColumn({ name: "recipientId" })
	recipient!: Relation<UserModel>;

	@Field(() => WorkspaceModel)
	@ManyToOne(() => WorkspaceModel, { onDelete: "CASCADE" })
	@JoinColumn({ name: "workspaceId" })
	workspace!: Relation<WorkspaceModel>;

	@Field(() => UserModel, { nullable: true })
	@ManyToOne(() => UserModel, { nullable: true, onDelete: "SET NULL" })
	@JoinColumn({ name: "actorId" })
	actor!: Relation<UserModel> | null;
}
