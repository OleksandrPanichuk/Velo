import { MailTemplate } from "@/infrastructure/mailer/mailer.typedefs";
import { MailerService } from "@/infrastructure/mailer";
import { MailProcessor } from "@/queues/mail/mail.processor";
import type { Job } from "bullmq";

const mockMailerService: Partial<MailerService> = {
	send: vi.fn(),
};

const buildProcessor = () => new MailProcessor(mockMailerService as MailerService);

const makeJob = (data: object) => ({ id: "job-1", data } as Job);

describe("MailProcessor", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("process", () => {
		it("delegates to mailer service with job data", async () => {
			vi.mocked(mockMailerService.send!).mockResolvedValue(undefined);

			const jobData = {
				to: "user@example.com",
				subject: "Verify your email",
				template: MailTemplate.EMAIL_VERIFICATION,
				context: { verificationUrl: "http://verify.example.com", expiresIn: "7 days" },
			};

			await buildProcessor().process(makeJob(jobData));

			expect(mockMailerService.send).toHaveBeenCalledWith({
				to: "user@example.com",
				subject: "Verify your email",
				template: MailTemplate.EMAIL_VERIFICATION,
				context: { verificationUrl: "http://verify.example.com", expiresIn: "7 days" },
			});
		});

		it("propagates errors thrown by mailer service", async () => {
			vi.mocked(mockMailerService.send!).mockRejectedValue(new Error("SMTP error"));

			const jobData = {
				to: "user@example.com",
				subject: "Reset password",
				template: MailTemplate.RESET_PASSWORD,
				context: { resetUrl: "http://reset.example.com", expiresIn: "1 hour" },
			};

			await expect(buildProcessor().process(makeJob(jobData))).rejects.toThrow("SMTP error");
		});
	});
});
