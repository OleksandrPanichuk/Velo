import {
	EmailVerificationContext,
	MailTemplate,
	ResetPasswordContext,
	SendMailInput,
	SignInAlertContext,
	WelcomeContext,
} from "@/infrastructure/mailer";
import { MAILER_SUBJECTS } from "@/infrastructure/mailer/mailer.constants";
import { QueueName } from "@/infrastructure/queue";
import { MAIL_JOB_OPTIONS } from "@/queues/mail/mail.queue.constants";
import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";

@Injectable()
export class MailQueue {
	constructor(@InjectQueue(QueueName.MAIL) private readonly queue: Queue<SendMailInput>) {}

	public async enqueueEmailVerification(to: string, ctx: EmailVerificationContext) {
		return this.queue.add(
			MailTemplate.EMAIL_VERIFICATION,
			{
				to,
				subject: MAILER_SUBJECTS[MailTemplate.EMAIL_VERIFICATION],
				template: MailTemplate.EMAIL_VERIFICATION,
				context: ctx,
			},
			MAIL_JOB_OPTIONS,
		);
	}

	public async enqueuePasswordReset(to: string, ctx: ResetPasswordContext) {
		return this.queue.add(
			MailTemplate.RESET_PASSWORD,
			{
				to,
				subject: MAILER_SUBJECTS[MailTemplate.RESET_PASSWORD],
				template: MailTemplate.RESET_PASSWORD,
				context: ctx,
			},
			MAIL_JOB_OPTIONS,
		);
	}

	public async enqueueWelcome(to: string, ctx: WelcomeContext) {
		return this.queue.add(
			MailTemplate.WELCOME,
			{
				to,
				subject: MAILER_SUBJECTS[MailTemplate.WELCOME],
				template: MailTemplate.WELCOME,
				context: ctx,
			},
			MAIL_JOB_OPTIONS,
		);
	}

	public async enqueueSignInAlert(to: string, ctx: SignInAlertContext) {
		return this.queue.add(
			MailTemplate.SIGN_IN_ALERT,
			{
				to,
				subject: MAILER_SUBJECTS[MailTemplate.SIGN_IN_ALERT],
				template: MailTemplate.SIGN_IN_ALERT,
				context: ctx,
			},
			MAIL_JOB_OPTIONS,
		);
	}
}
