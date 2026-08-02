import type { ApiClient } from "@/helpers/api";
import type { TestUserInput } from "@/helpers/factory";
import type { MailClient } from "@/helpers/mail";
import type { ForgotPasswordPage } from "@/pages/forgotPassword.page";
import type { InboxPage } from "@/pages/inbox.page";
import type { InvitePage } from "@/pages/invite.page";
import type { LoginPage } from "@/pages/login.page";
import type { MembersPage } from "@/pages/members.page";
import type { NotFoundPage } from "@/pages/notFound.page";
import type { OnboardingPage } from "@/pages/onboarding.page";
import type { RegisterPage } from "@/pages/register.page";
import type { ResetPasswordPage } from "@/pages/resetPassword.page";
import type { SettingsPage } from "@/pages/settings.page";
import type { VerifyEmailPage } from "@/pages/verifyEmail.page";
import type { WorkspaceShell } from "@/pages/workspaceShell.page";

export interface SignedInUser {
	id: string;
	credentials: TestUserInput;
}

export interface TestWorkspace {
	id: string;
	slug: string;
	name: string;
}

export interface Pages {
	login: LoginPage;
	register: RegisterPage;
	forgotPassword: ForgotPasswordPage;
	resetPassword: ResetPasswordPage;
	verifyEmail: VerifyEmailPage;
	onboarding: OnboardingPage;
	shell: WorkspaceShell;
	inbox: InboxPage;
	members: MembersPage;
	settings: SettingsPage;
	invite: InvitePage;
	notFound: NotFoundPage;
}

export interface Fixtures {
	api: ApiClient;
	mail: MailClient;
	signedInUser: SignedInUser;
	workspace: TestWorkspace;
	pages: Pages;
}
