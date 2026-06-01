import { Processor, WorkerHost } from "@nestjs/bullmq";
import { QueueName } from "@/infrastructure/queue";
import { Logger } from "@nestjs/common";
import { MailerService, SendMailInput } from "@/infrastructure/mailer";
import { Job } from "bullmq";

@Processor(QueueName.MAIL)
export class MailProcessor extends WorkerHost {
	private readonly logger = new Logger(MailProcessor.name);

	constructor(private readonly mailerService: MailerService) {
		super();
	}

	public async process(job: Job<SendMailInput>): Promise<void> {
		const { data } = job;
		const { to, subject, context, template } = data;

		this.logger.log(`Processing mail job ${job.id}: ${template} -> ${to}`);

		await this.mailerService.send({ to, template, context, subject });
	}
}
