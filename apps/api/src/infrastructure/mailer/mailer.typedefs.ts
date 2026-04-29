import type { AnyRecord } from "@/types/common.typedefs";

export enum MailTemplate {
	WELCOME = "welcome",
	RESET_PASSWORD = "reset-password",
	EMAIL_VERIFICATION = "email-verification",
	SIGN_IN_ALERT = "sign-in-alert",
}

export interface SendMailInput {
	to: string;
	subject: string;
	template: MailTemplate;
	context: AnyRecord;
}

export interface WelcomeContext {
	username: string;
}

export interface ResetPasswordContext {
	resetUrl: string;
	expiresIn: string;
}

export interface EmailVerificationContext {
	verificationUrl: string;
	expiresIn: string;
}

export interface SignInAlertContext {
	ipAddress: string;
	userAgent: string;
	time: string;
}
