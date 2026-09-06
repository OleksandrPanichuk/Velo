import {
	EmailVerificationContext,
	MailTemplate,
	ResetPasswordContext,
	SendMailInput,
	SignInAlertContext,
	WelcomeContext,
	WorkspaceInviteContext,
} from "@/infrastructure/mailer";
import { MAILER_SUBJECTS } from "@/infrastructure/mailer/mailer.constants";
import { QueueName } from "@/infrastructure/queue";
import { MAIL_JOB_OPTIONS } from "@/queues/mail/mail.queue.constants";
import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { type Job, Queue } from "bullmq";

@Injectable()
export class MailQueue {
	constructor(@InjectQueue(QueueName.MAIL) private readonly queue: Queue<SendMailInput>) {}

	public async enqueueEmailVerification(
		to: string,
		ctx: EmailVerificationContext,
	): Promise<Job<SendMailInput>> {
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

	public async enqueuePasswordReset(
		to: string,
		ctx: ResetPasswordContext,
	): Promise<Job<SendMailInput>> {
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

	public async enqueueWelcome(to: string, ctx: WelcomeContext): Promise<Job<SendMailInput>> {
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

	public async enqueueSignInAlert(
		to: string,
		ctx: SignInAlertContext,
	): Promise<Job<SendMailInput>> {
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

	public async enqueueWorkspaceInvite(
		to: string,
		ctx: WorkspaceInviteContext,
	): Promise<Job<SendMailInput>> {
		return this.queue.add(
			MailTemplate.WORKSPACE_INVITE,
			{
				to,
				subject: MAILER_SUBJECTS[MailTemplate.WORKSPACE_INVITE],
				template: MailTemplate.WORKSPACE_INVITE,
				context: ctx,
			},
			MAIL_JOB_OPTIONS,
		);
	}
}
