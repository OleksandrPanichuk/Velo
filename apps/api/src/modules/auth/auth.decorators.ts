import { UserModel } from "@/models/User.model";
import { applyDecorators, UseGuards } from "@nestjs/common";
import { Mutation } from "@nestjs/graphql";
import { JwtAccessGuard, JwtRefreshGuard } from "./auth.guards";

export const SignUpMutation = (): MethodDecorator =>
	applyDecorators(
		Mutation(() => UserModel, {
			description:
				"Register a new user account with email, username, and password. " +
				"On success, sets HttpOnly access and refresh token cookies and returns the created user.",
		}),
	);

export const SignInMutation = (): MethodDecorator =>
	applyDecorators(
		Mutation(() => UserModel, {
			description:
				"Authenticate with email and password. " +
				"On success, sets HttpOnly access and refresh token cookies and returns the authenticated user.",
		}),
	);

export const RefreshMutation = (): MethodDecorator =>
	applyDecorators(
		UseGuards(JwtRefreshGuard),
		Mutation(() => UserModel, {
			description:
				"Rotate the token pair using a valid refresh token cookie. " +
				"Issues new access and refresh tokens and returns the current user. " +
				"Requires a valid refresh_token cookie.",
		}),
	);

export const SignOutMutation = (): MethodDecorator =>
	applyDecorators(
		UseGuards(JwtAccessGuard),
		Mutation(() => Boolean, {
			description:
				"Sign out the current user. " +
				"Clears the refresh token from the database and removes all auth cookies. " +
				"Requires a valid access_token cookie.",
		}),
	);

export const VerifyEmailMutation = (): MethodDecorator =>
	applyDecorators(
		Mutation(() => Boolean, {
			description:
				"Verify a user's email address using the token sent to their inbox. " +
				"Returns true on success.",
		}),
	);

export const ForgotPasswordMutation = (): MethodDecorator =>
	applyDecorators(
		Mutation(() => Boolean, {
			description:
				"Request a password reset email. " + "Always returns true to prevent email enumeration.",
		}),
	);

export const ResetPasswordMutation = (): MethodDecorator =>
	applyDecorators(
		Mutation(() => Boolean, {
			description:
				"Reset a user's password using the token from the reset email. " +
				"Returns true on success.",
		}),
	);
