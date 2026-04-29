import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

@InputType({ description: "Details required to register a new user account" })
export class SignUpInput {
	@Field({ description: "A unique, valid email address" })
	@IsEmail()
	email!: string;

	@Field({ description: "A unique display name between 3 and 35 characters" })
	@IsString()
	@MinLength(3)
	@MaxLength(35)
	username!: string;

	@Field({ description: "Full display name" })
	@IsString()
	@MinLength(1)
	@MaxLength(100)
	fullName!: string;

	@Field({ description: "A strong password of at least 8 characters" })
	@IsString()
	@MinLength(8)
	password!: string;
}
