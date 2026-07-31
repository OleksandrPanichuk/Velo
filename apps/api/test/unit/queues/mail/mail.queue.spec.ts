import { MAILER_SUBJECTS } from "@/infrastructure/mailer/mailer.constants";
import { MailTemplate } from "@/infrastructure/mailer/mailer.typedefs";
import { MailQueue } from "@/queues/mail/mail.queue";
import { MAIL_JOB_OPTIONS } from "@/queues/mail/mail.queue.constants";
import type { Queue } from "bullmq";

const mockQueue: Partial<Queue> = {
	add: vi.fn(),
};

const buildQueue = () => new MailQueue(mockQueue as Queue);

describe("MailQueue", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("enqueueEmailVerification", () => {
		it("adds EMAIL_VERIFICATION job to queue with correct payload", async () => {
			vi.mocked(mockQueue.add!).mockResolvedValue({} as never);

			await buildQueue().enqueueEmailVerification("user@example.com", {
				verificationUrl: "http://verify.example.com",
				expiresIn: "7 days",
			});

			expect(mockQueue.add).toHaveBeenCalledWith(
				MailTemplate.EMAIL_VERIFICATION,
				{
					to: "user@example.com",
					subject: MAILER_SUBJECTS[MailTemplate.EMAIL_VERIFICATION],
					template: MailTemplate.EMAIL_VERIFICATION,
					context: { verificationUrl: "http://verify.example.com", expiresIn: "7 days" },
				},
				MAIL_JOB_OPTIONS,
			);
		});
	});

	describe("enqueuePasswordReset", () => {
		it("adds RESET_PASSWORD job to queue with correct payload", async () => {
			vi.mocked(mockQueue.add!).mockResolvedValue({} as never);

			await buildQueue().enqueuePasswordReset("user@example.com", {
				resetUrl: "http://reset.example.com",
				expiresIn: "1 hour",
			});

			expect(mockQueue.add).toHaveBeenCalledWith(
				MailTemplate.RESET_PASSWORD,
				{
					to: "user@example.com",
					subject: MAILER_SUBJECTS[MailTemplate.RESET_PASSWORD],
					template: MailTemplate.RESET_PASSWORD,
					context: { resetUrl: "http://reset.example.com", expiresIn: "1 hour" },
				},
				MAIL_JOB_OPTIONS,
			);
		});
	});

	describe("enqueueWelcome", () => {
		it("adds WELCOME job to queue with correct payload", async () => {
			vi.mocked(mockQueue.add!).mockResolvedValue({} as never);

			await buildQueue().enqueueWelcome("user@example.com", {
				username: "John",
			});

			expect(mockQueue.add).toHaveBeenCalledWith(
				MailTemplate.WELCOME,
				{
					to: "user@example.com",
					subject: MAILER_SUBJECTS[MailTemplate.WELCOME],
					template: MailTemplate.WELCOME,
					context: { username: "John" },
				},
				MAIL_JOB_OPTIONS,
			);
		});
	});

	describe("enqueueSignInAlert", () => {
		it("adds SIGN_IN_ALERT job to queue with correct payload", async () => {
			vi.mocked(mockQueue.add!).mockResolvedValue({} as never);

			await buildQueue().enqueueSignInAlert("user@example.com", {
				ipAddress: "127.0.0.1",
				userAgent: "TestBrowser/1.0",
				time: "2024-01-01T00:00:00Z",
			});

			expect(mockQueue.add).toHaveBeenCalledWith(
				MailTemplate.SIGN_IN_ALERT,
				{
					to: "user@example.com",
					subject: MAILER_SUBJECTS[MailTemplate.SIGN_IN_ALERT],
					template: MailTemplate.SIGN_IN_ALERT,
					context: { ipAddress: "127.0.0.1", userAgent: "TestBrowser/1.0", time: "2024-01-01T00:00:00Z" },
				},
				MAIL_JOB_OPTIONS,
			);
		});
	});
});
