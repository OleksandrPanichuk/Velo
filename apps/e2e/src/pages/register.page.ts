import { expect, type Page } from "@playwright/test";

import { RegisterFormHarness } from "@web/features/auth/ui/components/RegisterForm.harness";

import type { TestUserInput } from "@/helpers/factory";
import { byQa } from "@/helpers/qa";
import { BasePage } from "@/pages/base.page";

export class RegisterPage extends BasePage {
	protected readonly path = "/register";

	private readonly fullName = byQa(this.page, RegisterFormHarness.FullName);
	private readonly username = byQa(this.page, RegisterFormHarness.Username);
	private readonly email = byQa(this.page, RegisterFormHarness.Email);
	private readonly password = byQa(this.page, RegisterFormHarness.Password);
	private readonly confirmPassword = byQa(this.page, RegisterFormHarness.ConfirmPassword);
	private readonly submit = byQa(this.page, RegisterFormHarness.Submit);
	private readonly serverError = byQa(this.page, RegisterFormHarness.ServerError);
	private readonly loginLink = byQa(this.page, RegisterFormHarness.LoginLink);
	private readonly googleButton = byQa(this.page, RegisterFormHarness.GoogleButton);

	constructor(page: Page) {
		super(page);
	}

	async gotoWithInvite(token: string) {
		await this.goto(`${this.path}?invite=${encodeURIComponent(token)}`);
	}

	async register(user: TestUserInput) {
		await this.fullName.fill(user.fullName);
		await this.username.fill(user.username);
		await this.email.fill(user.email);
		await this.password.fill(user.password);
		await this.confirmPassword.fill(user.password);
		await this.confirmPassword.blur();
		await this.submit.click();
	}

	async expectLoaded() {
		await this.expectVisible(this.submit);
	}

	async expectError(message: string | RegExp) {
		await expect(this.serverError).toContainText(message);
		await this.expectAt();
	}

	async expectOAuthAvailable() {
		await this.expectVisible(this.googleButton);
	}

	async expectInviteTokenCarried(token: string) {
		await expect(this.page).toHaveURL(/\/register\?invite=/);
		await expect
			.poll(() => new URL(this.page.url()).searchParams.get("invite"))
			.toBe(token);
	}

	async expectLoginLinkCarriesInvite(token: string) {
		await expect(this.loginLink).toHaveAttribute("href", new RegExp(`invite=${token}`));
	}
}
