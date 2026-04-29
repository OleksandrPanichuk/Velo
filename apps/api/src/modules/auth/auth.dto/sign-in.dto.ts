import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsString, MinLength } from "class-validator";

@InputType({ description: "Credentials required to sign in to an existing account" })
export class SignInInput {
	@Field({ description: "The email address associated with the account" })
	@IsEmail()
	email!: string;

	@Field({ description: "The account password (minimum 8 characters)" })
	@IsString()
	@MinLength(8)
	password!: string;
}
