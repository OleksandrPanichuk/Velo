import { MailTemplate } from "./mailer.typedefs";

export const MAILER_SUBJECTS: Record<MailTemplate, string> = {
	[MailTemplate.WELCOME]: "Welcome to Velo!",
	[MailTemplate.RESET_PASSWORD]: "Reset your password",
	[MailTemplate.EMAIL_VERIFICATION]: "Verify your email address",
	[MailTemplate.SIGN_IN_ALERT]: "New sign-in to your account",
	[MailTemplate.WORKSPACE_INVITE]: "You have been invited to a Velo workspace",
};
