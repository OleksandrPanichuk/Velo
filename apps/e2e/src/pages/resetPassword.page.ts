import { expect, type Page } from "@playwright/test";

import { ResetPasswordFormHarness } from "@web/features/auth/ui/components/ResetPasswordForm.harness";

import { byQa } from "@/helpers/qa";
import { BasePage } from "@/pages/base.page";

export class ResetPasswordPage extends BasePage {
	protected readonly path = "/reset-password";

	private readonly password = byQa(this.page, ResetPasswordFormHarness.Password);
	private readonly confirmPassword = byQa(this.page, ResetPasswordFormHarness.ConfirmPassword);
	private readonly submit = byQa(this.page, ResetPasswordFormHarness.Submit);
	private readonly serverError = byQa(this.page, ResetPasswordFormHarness.ServerError);
	private readonly success = byQa(this.page, ResetPasswordFormHarness.Success);
	private readonly successContinue = byQa(this.page, ResetPasswordFormHarness.SuccessContinue);
	private readonly invalidToken = byQa(this.page, ResetPasswordFormHarness.InvalidToken);

	constructor(page: Page) {
		super(page);
	}

	async gotoWithToken(token: string) {
		await this.goto(`${this.path}?token=${encodeURIComponent(token)}`);
	}

	async gotoWithoutToken() {
		await this.goto(this.path);
	}

	async resetTo(password: string) {
		await this.password.fill(password);
		await this.confirmPassword.fill(password);
		await this.confirmPassword.blur();
		await this.submit.click();
	}

	async continueToSignIn() {
		await this.successContinue.click();
	}

	async expectLoaded() {
		await this.expectVisible(this.submit);
	}

	async expectSuccess() {
		await this.expectVisible(this.success);
	}

	async expectInvalidToken() {
		await this.expectVisible(this.invalidToken);
	}

	async expectError(message: string | RegExp) {
		await expect(this.serverError).toContainText(message);
	}
}
