import type { Page } from "@playwright/test";

import { ForgotPasswordPage } from "@/pages/forgotPassword.page";
import { InboxPage } from "@/pages/inbox.page";
import { InvitePage } from "@/pages/invite.page";
import { LoginPage } from "@/pages/login.page";
import { MembersPage } from "@/pages/members.page";
import { NotFoundPage } from "@/pages/notFound.page";
import { OnboardingPage } from "@/pages/onboarding.page";
import { RegisterPage } from "@/pages/register.page";
import { ResetPasswordPage } from "@/pages/resetPassword.page";
import { SettingsPage } from "@/pages/settings.page";
import { VerifyEmailPage } from "@/pages/verifyEmail.page";
import { WorkspaceShell } from "@/pages/workspaceShell.page";
import type { Pages } from "@/fixtures/types";

export async function pagesFixture({ page }: { page: Page }, use: (pages: Pages) => Promise<void>) {
	await use({
		login: new LoginPage(page),
		register: new RegisterPage(page),
		forgotPassword: new ForgotPasswordPage(page),
		resetPassword: new ResetPasswordPage(page),
		verifyEmail: new VerifyEmailPage(page),
		onboarding: new OnboardingPage(page),
		shell: new WorkspaceShell(page),
		inbox: new InboxPage(page),
		members: new MembersPage(page),
		settings: new SettingsPage(page),
		invite: new InvitePage(page),
		notFound: new NotFoundPage(page),
	});
}
