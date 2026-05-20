import { Field, InputType } from "@nestjs/graphql";
import { IsString, MaxLength, MinLength } from "class-validator";

@InputType({ description: "New password and the reset token from the email link" })
export class ResetPasswordInput {
	@Field({ description: "The password reset token from the email link" })
	@IsString()
	token!: string;

	@Field({ description: "The new password (minimum 8 characters)" })
	@IsString()
	@MinLength(8)
	@MaxLength(128)
	password!: string;
}
