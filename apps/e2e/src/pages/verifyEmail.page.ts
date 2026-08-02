import { expect, type Page } from "@playwright/test";

import { VerifyEmailViewHarness } from "@web/features/auth/ui/components/VerifyEmailView.harness";

import { byQa } from "@/helpers/qa";
import { BasePage } from "@/pages/base.page";

export class VerifyEmailPage extends BasePage {
	protected readonly path = "/verify-email";

	private readonly success = byQa(this.page, VerifyEmailViewHarness.Success);
	private readonly error = byQa(this.page, VerifyEmailViewHarness.Error);
	private readonly title = byQa(this.page, VerifyEmailViewHarness.Title);
	private readonly continueToLogin = byQa(this.page, VerifyEmailViewHarness.ContinueToLogin);

	constructor(page: Page) {
		super(page);
	}

	async gotoWithToken(token: string) {
		await this.goto(`${this.path}?token=${encodeURIComponent(token)}`);
	}

	async gotoWithoutToken() {
		await this.goto(this.path);
	}

	async continueToSignIn() {
		await this.continueToLogin.click();
	}

	async expectVerified() {
		await this.expectVisible(this.success);
	}

	async expectContinueToSignInAvailable() {
		await this.expectVisible(this.continueToLogin);
	}

	async expectFailed() {
		await this.expectVisible(this.error);
		await expect(this.title).toHaveText("Verification failed");
	}

	async expectMissingToken() {
		await this.expectVisible(this.error);
		await expect(this.title).toHaveText("Invalid link");
	}
}
