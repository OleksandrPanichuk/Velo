import { expect, type Page } from "@playwright/test";

import { ForgotPasswordFormHarness } from "@web/features/auth/ui/components/ForgotPasswordForm.harness";

import { byQa } from "@/helpers/qa";
import { BasePage } from "@/pages/base.page";

export class ForgotPasswordPage extends BasePage {
	protected readonly path = "/forgot-password";

	private readonly email = byQa(this.page, ForgotPasswordFormHarness.Email);
	private readonly submit = byQa(this.page, ForgotPasswordFormHarness.Submit);
	private readonly serverError = byQa(this.page, ForgotPasswordFormHarness.ServerError);
	private readonly submitted = byQa(this.page, ForgotPasswordFormHarness.Submitted);
	private readonly submittedEmail = byQa(this.page, ForgotPasswordFormHarness.SubmittedEmail);
	private readonly tryAnotherEmail = byQa(this.page, ForgotPasswordFormHarness.TryAnotherEmail);

	constructor(page: Page) {
		super(page);
	}

	async submitEmail(email: string) {
		await this.email.fill(email);
		await this.submit.click();
	}

	async tryAnother() {
		await this.tryAnotherEmail.click();
	}

	async expectLoaded() {
		await this.expectVisible(this.submit);
	}

	async expectSubmitted(email: string) {
		await this.expectVisible(this.submitted);
		await expect(this.submittedEmail).toHaveText(email);
	}

	async expectError(message: string | RegExp) {
		await expect(this.serverError).toContainText(message);
	}
}
