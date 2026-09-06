import { Field, ObjectType } from "@nestjs/graphql";
import { BaseModelWithDeletedAt } from "./Base.model";
import { Column, Entity, JoinColumn, ManyToOne, type Relation, Unique } from "typeorm";
import { TeamModel } from "./Team.model";
import { UserModel } from "./User.model";
import { DateTimeResolver } from "graphql-scalars";

@ObjectType()
@Entity("team_members")
@Unique(["teamId", "userId"])
export class TeamMemberModel extends BaseModelWithDeletedAt {
	@Column({ type: "uuid" })
	teamId!: string;

	@Column({ type: "uuid" })
	userId!: string;

	@Field(() => TeamModel)
	@ManyToOne(() => TeamModel, (t) => t.members, { onDelete: "CASCADE" })
	@JoinColumn({ name: "teamId" })
	team!: Relation<TeamModel>;

	@Field(() => UserModel)
	@ManyToOne(() => UserModel, (u) => u.teamMembers, { onDelete: "CASCADE" })
	@JoinColumn({ name: "userId" })
	user!: Relation<UserModel>;

	@Field(() => DateTimeResolver)
	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	joinedAt!: Date;
}
