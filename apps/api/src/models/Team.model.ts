import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, type Relation, Unique } from "typeorm";
import { BaseModelWithDeletedAt } from "./Base.model";
import { WorkspaceModel } from "./Workspace.model";
import { TeamMemberModel } from "./TeamMember.model";

@ObjectType()
@Entity("teams")
@Unique(["workspaceId", "identifier"])
export class TeamModel extends BaseModelWithDeletedAt {
	@Column({ type: "uuid" })
	workspaceId!: string;

	@Field()
	@Column()
	name!: string;

	@Field()
	@Column({ type: "varchar", length: 20 })
	identifier!: string;

	@Field()
	@Column({ type: "varchar", length: 10 })
	color!: string;

	@Field(() => WorkspaceModel)
	@ManyToOne(() => WorkspaceModel, (w) => w.teams, { onDelete: "CASCADE" })
	@JoinColumn({ name: "workspaceId" })
	workspace!: Relation<WorkspaceModel>;

	@Field(() => [TeamMemberModel])
	@OneToMany(() => TeamMemberModel, (m) => m.team)
	members!: Relation<TeamMemberModel[]>;
}
