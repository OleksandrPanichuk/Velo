import { Field, ObjectType } from "@nestjs/graphql";
import { DateTimeResolver, UUIDResolver } from "graphql-scalars";
import {
	CreateDateColumn,
	DeleteDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

@ObjectType({ isAbstract: true })
export abstract class BaseModel {
	@Field(() => UUIDResolver)
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Field(() => DateTimeResolver)
	@CreateDateColumn()
	createdAt!: Date;

	@Field(() => DateTimeResolver)
	@UpdateDateColumn()
	updatedAt!: Date;
}

@ObjectType({ isAbstract: true })
export abstract class BaseModelWithDeletedAt extends BaseModel {
	@Field(() => DateTimeResolver, { nullable: true })
	@DeleteDateColumn({ nullable: true })
	deletedAt!: Date | null;
}
