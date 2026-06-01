import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { QueueName } from "@/infrastructure/queue";
import { MailerModule } from "@/infrastructure/mailer";
import { MailProcessor } from "@/queues/mail/mail.processor";
import { MailQueue } from "@/queues/mail/mail.queue";

@Module({
	imports: [BullModule.registerQueue({ name: QueueName.MAIL }), MailerModule],
	providers: [MailProcessor, MailQueue],
	exports: [MailQueue],
})
export class MailQueueModule {}
