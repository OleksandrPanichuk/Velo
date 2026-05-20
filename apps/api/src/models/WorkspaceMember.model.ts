import { WorkspaceMemberRole } from "@/enums";
import { Field, ObjectType } from "@nestjs/graphql";
import { DateTimeResolver } from "graphql-scalars";
import { Column, Entity, JoinColumn, ManyToOne, type Relation, Unique } from "typeorm";
import { BaseModel } from "./Base.model";
import { UserModel } from "./User.model";
import { WorkspaceModel } from "./Workspace.model";

@ObjectType()
@Entity("workspace_members")
@Unique(["workspaceId", "userId"])
export class WorkspaceMemberModel extends BaseModel {
	@Column({ type: "uuid" })
	workspaceId!: string;

	@Column({ type: "uuid" })
	userId!: string;

	@Field(() => WorkspaceModel)
	@ManyToOne(() => WorkspaceModel, (w) => w.members, { onDelete: "CASCADE" })
	@JoinColumn({ name: "workspaceId" })
	workspace!: Relation<WorkspaceModel>;

	@Field(() => UserModel)
	@ManyToOne(() => UserModel, (u) => u.workspaceMembers, { onDelete: "CASCADE" })
	@JoinColumn({ name: "userId" })
	user!: Relation<UserModel>;

	@Field(() => WorkspaceMemberRole)
	@Column({ type: "enum", enum: WorkspaceMemberRole, default: WorkspaceMemberRole.MEMBER })
	role!: WorkspaceMemberRole;

	@Field(() => DateTimeResolver)
	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	joinedAt!: Date;
}
