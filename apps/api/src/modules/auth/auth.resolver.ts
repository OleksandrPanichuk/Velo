import { AppClsService } from "@/infrastructure/cls/cls.service";
import type { UserModel } from "@/models/User.model";
import { Public } from "@/shared/decorators";
import { Args, Resolver } from "@nestjs/graphql";
import {
	ForgotPasswordMutation,
	RefreshMutation,
	ResetPasswordMutation,
	SignInMutation,
	SignOutMutation,
	SignUpMutation,
	VerifyEmailMutation,
} from "./auth.decorators";
import { ForgotPasswordInput, ResetPasswordInput, SignInInput, SignUpInput } from "./auth.dto";
import { AuthService } from "./auth.service";

@Public()
@Resolver()
export class AuthResolver {
	constructor(
		private readonly authService: AuthService,
		private readonly cls: AppClsService,
	) {}

	@SignUpMutation()
	public async signUp(@Args("input") input: SignUpInput): Promise<UserModel> {
		return this.authService.signUp(input);
	}

	@SignInMutation()
	public async signIn(@Args("input") input: SignInInput): Promise<UserModel> {
		return this.authService.signIn(input);
	}

	@RefreshMutation()
	public async refresh(): Promise<UserModel> {
		return this.authService.refresh(this.cls.userId as string);
	}

	@SignOutMutation()
	public async signOut(): Promise<boolean> {
		await this.authService.signOut(this.cls.userId as string);
		return true;
	}

	@VerifyEmailMutation()
	public async verifyEmail(@Args("token") token: string): Promise<boolean> {
		return this.authService.verifyEmail(token);
	}

	@ForgotPasswordMutation()
	public async forgotPassword(@Args("input") input: ForgotPasswordInput): Promise<boolean> {
		return this.authService.forgotPassword(input);
	}

	@ResetPasswordMutation()
	public async resetPassword(@Args("input") input: ResetPasswordInput): Promise<boolean> {
		return this.authService.resetPassword(input);
	}
}
