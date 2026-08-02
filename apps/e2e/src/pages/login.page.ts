import { expect, type Page } from "@playwright/test";

import { LoginFormHarness } from "@web/features/auth/ui/components/LoginForm.harness";

import { byQa } from "@/helpers/qa";
import { BasePage } from "@/pages/base.page";

export class LoginPage extends BasePage {
	protected readonly path = "/login";

	private readonly email = byQa(this.page, LoginFormHarness.Email);
	private readonly password = byQa(this.page, LoginFormHarness.Password);
	private readonly submit = byQa(this.page, LoginFormHarness.Submit);
	private readonly serverError = byQa(this.page, LoginFormHarness.ServerError);
	private readonly registerLink = byQa(this.page, LoginFormHarness.RegisterLink);
	private readonly forgotPasswordLink = byQa(this.page, LoginFormHarness.ForgotPasswordLink);

	constructor(page: Page) {
		super(page);
	}

	async signIn(email: string, password: string) {
		await this.email.fill(email);
		await this.password.fill(password);
		await this.submit.click();
	}

	async gotoRegister() {
		await this.registerLink.click();
	}

	async gotoForgotPassword() {
		await this.forgotPasswordLink.click();
	}

	async expectLoaded() {
		await this.expectVisible(this.submit);
	}

	async expectError(message: string | RegExp) {
		await expect(this.serverError).toContainText(message);
		await this.expectAt();
	}

	async expectRegisterLinkCarriesInvite(token: string) {
		await expect(this.registerLink).toHaveAttribute("href", new RegExp(`invite=${token}`));
	}
}
