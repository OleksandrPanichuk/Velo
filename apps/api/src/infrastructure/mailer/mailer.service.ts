import { Injectable, Logger, type OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import * as Handlebars from "handlebars";
import type { Transporter } from "nodemailer";
import * as nodemailer from "nodemailer";
import * as path from "path";
import type { Env } from "@/config";
import { MAILER_SUBJECTS } from "./mailer.constants";
import type {
	EmailVerificationContext,
	ResetPasswordContext,
	SendMailInput,
	SignInAlertContext,
	WelcomeContext,
} from "./mailer.typedefs";
import { MailTemplate } from "./mailer.typedefs";

@Injectable()
export class MailerService implements OnModuleInit {
	private readonly logger = new Logger(MailerService.name);
	private readonly transporter: Transporter;
	private readonly from: string;
	private readonly compiled = new Map<MailTemplate, HandlebarsTemplateDelegate>();

	constructor(private readonly config: ConfigService<Env>) {
		this.from = this.config.getOrThrow("SMTP_FROM");

		this.transporter = nodemailer.createTransport({
			host: this.config.getOrThrow<string>("SMTP_HOST"),
			port: this.config.getOrThrow<number>("SMTP_PORT"),
			secure: this.config.getOrThrow<boolean>("SMTP_SECURE"),
			auth: {
				user: this.config.getOrThrow<string>("SMTP_USER"),
				pass: this.config.getOrThrow<string>("SMTP_PASS"),
			},
		});

		this.loadTemplates();
	}

	public async onModuleInit(): Promise<void> {
		try {
			await this.transporter.verify();
			this.logger.log("SMTP connection established");
		} catch (error) {
			this.logger.warn(
				`SMTP connection failed — emails will not be sent: ${(error as Error).message}`,
			);
		}
	}

	public async sendWelcome(to: string, ctx: WelcomeContext): Promise<void> {
		await this.send({
			to,
			subject: MAILER_SUBJECTS[MailTemplate.WELCOME],
			template: MailTemplate.WELCOME,
			context: ctx,
		});
	}

	public async sendPasswordReset(to: string, ctx: ResetPasswordContext): Promise<void> {
		try {
			console.log("SEND RESET PASSWORD");
			await this.send({
				to,
				subject: MAILER_SUBJECTS[MailTemplate.RESET_PASSWORD],
				template: MailTemplate.RESET_PASSWORD,
				context: ctx,
			});
		} catch (error) {
			this.logger.error(error);
		}
	}

	public async sendEmailVerification(to: string, ctx: EmailVerificationContext): Promise<void> {
		await this.send({
			to,
			subject: MAILER_SUBJECTS[MailTemplate.EMAIL_VERIFICATION],
			template: MailTemplate.EMAIL_VERIFICATION,
			context: ctx,
		});
	}

	public async sendSignInAlert(to: string, ctx: SignInAlertContext): Promise<void> {
		await this.send({
			to,
			subject: MAILER_SUBJECTS[MailTemplate.SIGN_IN_ALERT],
			template: MailTemplate.SIGN_IN_ALERT,
			context: ctx,
		});
	}

	private async send(input: SendMailInput): Promise<void> {
		try {
			const html = this.compile(input.template, input.context);
			await this.transporter.sendMail({
				from: this.from,
				to: input.to,
				subject: input.subject,
				html,
			});
		} catch (error) {
			this.logger.error(
				`Failed to send "${input.template}" email to ${input.to}: ${(error as Error).message}`,
			);
			throw error;
		}
	}

	private compile(template: MailTemplate, context: Record<string, unknown>): string {
		const delegate = this.compiled.get(template);
		if (!delegate) {
			throw new Error(`Template "${template}" is not registered`);
		}
		return delegate(context);
	}

	private loadTemplates(): void {
		const distDir = path.join(__dirname, "templates");
		const srcDir = path.join(process.cwd(), "src", "infrastructure", "mailer", "templates");
		const dir = fs.existsSync(distDir) ? distDir : srcDir;

		Handlebars.registerHelper("year", () => new Date().getFullYear());

		const layoutSrc = fs.readFileSync(path.join(dir, "partials", "layout.hbs"), "utf8");
		Handlebars.registerPartial("layout", layoutSrc);

		for (const key of Object.values(MailTemplate)) {
			const src = fs.readFileSync(path.join(dir, `${key}.hbs`), "utf8");
			this.compiled.set(key, Handlebars.compile(src));
		}
	}
}
