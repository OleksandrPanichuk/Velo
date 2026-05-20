import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { BaseModelWithDeletedAt } from "./Base.model";
import { FileModel } from "./File.model";
import { TeamModel } from "./Team.model";
import { WorkspaceMemberModel } from "./WorkspaceMember.model";

@ObjectType()
@Entity("workspaces")
export class WorkspaceModel extends BaseModelWithDeletedAt {
	@Field()
	@Column({ unique: true })
	slug!: string;

	@Field()
	@Column()
	name!: string;

	@Column({ type: "uuid", nullable: true })
	logoId!: string | null;

	@Field(() => FileModel, { nullable: true })
	@OneToOne(() => FileModel, { nullable: true, onDelete: "SET NULL" })
	@JoinColumn({ name: "logoId" })
	logo!: FileModel | null;

	@Field(() => [WorkspaceMemberModel])
	@OneToMany(() => WorkspaceMemberModel, (m) => m.workspace)
	members!: WorkspaceMemberModel[];

	@Field(() => [TeamModel])
	@OneToMany(() => TeamModel, (t) => t.workspace)
	teams!: TeamModel[];
}
