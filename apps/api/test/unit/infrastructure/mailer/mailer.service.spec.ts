import { MailTemplate } from "@/infrastructure/mailer/mailer.typedefs";
import { MailerService } from "@/infrastructure/mailer/mailer.service";
import { ConfigService } from "@nestjs/config";

vi.mock("nodemailer", () => ({
	createTransport: vi.fn().mockReturnValue({
		verify: vi.fn().mockResolvedValue(true),
		sendMail: vi.fn().mockResolvedValue({ messageId: "test-id" }),
	}),
}));

vi.mock("fs", () => ({
	existsSync: vi.fn().mockReturnValue(false),
	readFileSync: vi.fn().mockReturnValue("<html>{{name}}</html>"),
}));

vi.mock("handlebars", () => ({
	compile: vi.fn().mockReturnValue((ctx: Record<string, unknown>) => `<html>${JSON.stringify(ctx)}</html>`),
	registerHelper: vi.fn(),
	registerPartial: vi.fn(),
}));

import * as nodemailer from "nodemailer";

const smtpConfig: Record<string, unknown> = {
	SMTP_FROM: "noreply@example.com",
	SMTP_HOST: "smtp.example.com",
	SMTP_PORT: 587,
	SMTP_SECURE: false,
	SMTP_USER: "user",
	SMTP_PASS: "pass",
};

const mockConfig = {
	getOrThrow: vi.fn((key: string) => smtpConfig[key]),
};

const buildService = () => new MailerService(mockConfig as unknown as ConfigService);

describe("MailerService", () => {
	beforeEach(() => vi.clearAllMocks());

	describe("send", () => {
		it("compiles the template and sends via transporter", async () => {
			const service = buildService();
			const mockTransporter = vi.mocked(nodemailer.createTransport)();

			await service.send({
				to: "user@example.com",
				subject: "Test Subject",
				template: MailTemplate.WELCOME,
				context: { username: "Alice" },
			});

			expect(mockTransporter.sendMail).toHaveBeenCalledWith(
				expect.objectContaining({
					from: "noreply@example.com",
					to: "user@example.com",
					subject: "Test Subject",
					html: expect.any(String),
				}),
			);
		});

		it("throws and logs when sendMail fails", async () => {
			const service = buildService();
			const mockTransporter = vi.mocked(nodemailer.createTransport)();
			vi.mocked(mockTransporter.sendMail).mockRejectedValue(new Error("SMTP error"));

			await expect(
				service.send({
					to: "user@example.com",
					subject: "Test",
					template: MailTemplate.WELCOME,
					context: {},
				}),
			).rejects.toThrow("SMTP error");
		});
	});

	describe("sendWelcome", () => {
		it("calls send with WELCOME template and correct subject", async () => {
			const service = buildService();
			const sendSpy = vi.spyOn(service, "send").mockResolvedValue();

			await service.sendWelcome("user@example.com", { username: "Alice" });

			expect(sendSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					to: "user@example.com",
					template: MailTemplate.WELCOME,
				}),
			);
		});
	});

	describe("sendPasswordReset", () => {
		it("calls send with RESET_PASSWORD template", async () => {
			const service = buildService();
			const sendSpy = vi.spyOn(service, "send").mockResolvedValue();

			await service.sendPasswordReset("user@example.com", {
				resetUrl: "http://reset.example.com",
				expiresIn: "1 hour",
			});

			expect(sendSpy).toHaveBeenCalledWith(
				expect.objectContaining({ template: MailTemplate.RESET_PASSWORD }),
			);
		});
	});

	describe("sendEmailVerification", () => {
		it("calls send with EMAIL_VERIFICATION template", async () => {
			const service = buildService();
			const sendSpy = vi.spyOn(service, "send").mockResolvedValue();

			await service.sendEmailVerification("user@example.com", {
				verificationUrl: "http://verify.example.com",
				expiresIn: "7 days",
			});

			expect(sendSpy).toHaveBeenCalledWith(
				expect.objectContaining({ template: MailTemplate.EMAIL_VERIFICATION }),
			);
		});
	});

	describe("sendSignInAlert", () => {
		it("calls send with SIGN_IN_ALERT template", async () => {
			const service = buildService();
			const sendSpy = vi.spyOn(service, "send").mockResolvedValue();

			await service.sendSignInAlert("user@example.com", {
				ipAddress: "127.0.0.1",
				userAgent: "Chrome",
				time: "2024-01-01T00:00:00Z",
			});

			expect(sendSpy).toHaveBeenCalledWith(
				expect.objectContaining({ template: MailTemplate.SIGN_IN_ALERT }),
			);
		});
	});
});
