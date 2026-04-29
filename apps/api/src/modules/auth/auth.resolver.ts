import { AppClsService } from "@/infrastructure/cls/cls.service";
import type { UserModel } from "@/models/User.model";
import { GqlRes } from "@/shared/decorators";
import { Args, Resolver } from "@nestjs/graphql";
import type { Response } from "express";
import { RefreshMutation, SignInMutation, SignOutMutation, SignUpMutation } from "./auth.decorators";
import { SignInInput } from "./auth.dto/sign-in.dto";
import { SignUpInput } from "./auth.dto/sign-up.dto";
import { AuthService } from "./auth.service";

@Resolver()
export class AuthResolver {
	constructor(
		private readonly authService: AuthService,
		private readonly cls: AppClsService,
	) {}

	@SignUpMutation()
	public async signUp(@Args("input") input: SignUpInput, @GqlRes() res: Response): Promise<UserModel> {
		return this.authService.signUp(input, res);
	}

	@SignInMutation()
	public async signIn(@Args("input") input: SignInInput, @GqlRes() res: Response): Promise<UserModel> {
		return this.authService.signIn(input, res);
	}

	@RefreshMutation()
	public async refresh(@GqlRes() res: Response): Promise<UserModel> {
		return this.authService.refresh(this.cls.userId as string, res);
	}

	@SignOutMutation()
	public async signOut(@GqlRes() res: Response): Promise<boolean> {
		await this.authService.signOut(this.cls.userId as string, res);
		return true;
	}
}
