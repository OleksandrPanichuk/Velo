import { expect, type Page } from "@playwright/test";

import { AcceptInviteHarness } from "@web/features/invite/ui/components/AcceptInvite.harness";
import { InviteAuthPromptHarness } from "@web/features/invite/ui/components/InviteAuthPrompt.harness";
import { InviteMessageHarness } from "@web/features/invite/ui/components/InviteMessage.harness";
import { MissingInviteTokenHarness } from "@web/features/invite/ui/components/MissingInviteToken.harness";

import { byQa } from "@/helpers/qa";
import { BasePage } from "@/pages/base.page";

export class InvitePage extends BasePage {
	protected readonly path = "/invite";

	private readonly title = byQa(this.page, InviteMessageHarness.Title);
	private readonly description = byQa(this.page, InviteMessageHarness.Description);
	private readonly createAccount = byQa(this.page, InviteAuthPromptHarness.CreateAccount);
	private readonly signIn = byQa(this.page, InviteAuthPromptHarness.SignIn);
	private readonly signInWithInvitedAddress = byQa(
		this.page,
		AcceptInviteHarness.SignInWithInvitedAddress,
	);
	private readonly goToMyWorkspaces = byQa(this.page, AcceptInviteHarness.GoToMyWorkspaces);
	private readonly missingTokenBackToLogin = byQa(
		this.page,
		MissingInviteTokenHarness.BackToLogin,
	);

	constructor(page: Page) {
		super(page);
	}

	async gotoWithToken(token: string) {
		await this.goto(`${this.path}?token=${encodeURIComponent(token)}`);
	}

	async gotoWithoutToken() {
		await this.goto(this.path);
	}

	async gotoRegisterFromPrompt() {
		await this.createAccount.click();
	}

	async gotoLoginFromPrompt() {
		await this.signIn.click();
	}

	async signInWithInvitedEmail() {
		await this.signInWithInvitedAddress.click();
	}

	private async expectTitle(text: string) {
		await expect(this.title).toHaveText(text);
	}

	async expectAuthPrompt() {
		await this.expectTitle("You've been invited to Velo");
		await this.expectVisible(this.createAccount);
		await this.expectVisible(this.signIn);
	}

	async expectMissingToken() {
		await this.expectTitle("Invalid invite link");
		await this.expectVisible(this.missingTokenBackToLogin);
	}

	async expectNotFound() {
		await this.expectTitle("Invite not found");
	}

	async expectExpired() {
		await this.expectTitle("This invite has expired");
	}

	async expectAlreadyAccepted() {
		await this.expectTitle("This invite has already been used");
		await this.expectVisible(this.goToMyWorkspaces);
	}

	async expectWrongEmail() {
		await this.expectTitle("This invite is for another address");
		await this.expectVisible(this.signInWithInvitedAddress);
	}

	async expectWrongEmailFor(email: string) {
		await this.expectWrongEmail();
		await expect(this.description).toContainText(`You're signed in as ${email}`);
	}

	async expectJoinedWorkspace(slug: string) {
		await expect(this.page).toHaveURL(new RegExp(`/${slug}(/|$)`));
	}
}
