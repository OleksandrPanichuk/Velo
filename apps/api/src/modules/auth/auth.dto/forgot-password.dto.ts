import { Field, InputType } from "@nestjs/graphql";
import { IsEmail } from "class-validator";

@InputType({ description: "Email to send a password reset link to" })
export class ForgotPasswordInput {
	@Field({ description: "The email address associated with the account" })
	@IsEmail()
	email!: string;
}
