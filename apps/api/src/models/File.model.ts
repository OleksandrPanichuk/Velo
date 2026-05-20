import { Field, Int, ObjectType } from "@nestjs/graphql";
import { UUIDResolver } from "graphql-scalars";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseModelWithDeletedAt } from "./Base.model";
import { UserModel } from "./User.model";

@ObjectType()
@Entity("files")
export class FileModel extends BaseModelWithDeletedAt {
	@Column({ unique: true })
	key!: string;

	@Field()
	@Column()
	url!: string;

	@Field()
	@Column()
	originalName!: string;

	@Field()
	@Column({ length: 100 })
	mimeType!: string;

	@Field(() => Int)
	@Column({ type: "int" })
	size!: number;

	@Column({ type: "uuid", nullable: true })
	uploadedById!: string | null;

	@Field(() => UUIDResolver, { nullable: true })
	@ManyToOne(() => UserModel, { nullable: true, onDelete: "SET NULL" })
	@JoinColumn({ name: "uploadedById" })
	uploadedBy!: UserModel | null;
}
