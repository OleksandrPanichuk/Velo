import { Field, ObjectType } from "@nestjs/graphql";
import { DateTimeResolver, UUIDResolver } from "graphql-scalars";
import {
	CreateDateColumn,
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
