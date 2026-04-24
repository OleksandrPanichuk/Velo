import { Field, ObjectType } from "@nestjs/graphql";
import argon2 from "argon2";
import { EmailAddressResolver } from "graphql-scalars";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import { BaseModel } from "./Base.model";

@ObjectType()
@Entity("users")
export class UserModel extends BaseModel {
	@Field(() => EmailAddressResolver)
	@Column({ unique: true, length: 150 })
	email!: string;

	@Field()
	@Column({ length: 35, unique: true })
	username!: string;

	@Column({ select: false })
	password!: string;

	@BeforeInsert()
	@BeforeUpdate()
	async hashPassword() {
		if (this.password) {
			this.password = await argon2.hash(this.password);
		}
	}
}
