import type { APIRequestContext } from "@playwright/test";
import { expect } from "@playwright/test";

import { MAILPIT_URL } from "@/config";

interface MailpitSummary {
	ID: string;
	To: { Address: string }[];
	Subject: string;
}

export interface CapturedEmail {
	id: string;
	subject: string;
	to: string[];
	text: string;
	html: string;
}

function decodeEntities(value: string) {
	return value
		.replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
		.replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
		.replace(/&amp;/g, "&");
}

const INVITE_SUBJECT = "You have been invited to a Velo workspace";

export class MailClient {
	constructor(private readonly request: APIRequestContext) {}

	async deleteAll() {
		await this.request.delete(`${MAILPIT_URL}/api/v1/messages`);
	}

	private async list(): Promise<MailpitSummary[]> {
		const response = await this.request.get(`${MAILPIT_URL}/api/v1/messages?limit=200`);
		const body = (await response.json()) as { messages?: MailpitSummary[] };

		return body.messages ?? [];
	}

	private async read(id: string): Promise<CapturedEmail> {
		const response = await this.request.get(`${MAILPIT_URL}/api/v1/message/${id}`);
		const body = (await response.json()) as {
			ID: string;
			Subject: string;
			To: { Address: string }[];
			Text?: string;
			HTML?: string;
		};

		return {
			id: body.ID,
			subject: body.Subject,
			to: body.To.map((recipient) => recipient.Address),
			text: body.Text ?? "",
			html: body.HTML ?? "",
		};
	}

	async waitForEmail(to: string, options: { subjectContains?: string } = {}) {
		const recipient = to.toLowerCase();
		let found: CapturedEmail | undefined;

		await expect
			.poll(
				async () => {
					const summaries = await this.list();
					const match = summaries.find(
						(summary) =>
							summary.To.some((address) => address.Address.toLowerCase() === recipient) &&
							(!options.subjectContains || summary.Subject.includes(options.subjectContains)),
					);

					if (!match) return false;

					found = await this.read(match.ID);
					return true;
				},
				{
					message: `waiting for an email to ${to}${
						options.subjectContains ? ` with subject containing "${options.subjectContains}"` : ""
					}`,
					timeout: 20_000,
					intervals: [250, 500, 1000],
				},
			)
			.toBe(true);

		return found as CapturedEmail;
	}

	async waitForLink(to: string, options: { subjectContains?: string; urlContains: string }) {
		const email = await this.waitForEmail(to, options);
		const body = `${email.html}\n${email.text}`;
		const pattern = new RegExp(`https?://[^\\s"'<>]*${options.urlContains}[^\\s"'<>]*`, "i");
		const match = body.match(pattern);

		if (!match) {
			throw new Error(
				`email to ${to} contained no link matching "${options.urlContains}".\n${body.slice(0, 2000)}`,
			);
		}

		return decodeEntities(match[0]);
	}

	async waitForInviteLink(to: string) {
		return this.waitForLink(to, { subjectContains: INVITE_SUBJECT, urlContains: "/invite" });
	}

	async waitForInviteToken(to: string) {
		return this.waitForToken(to, { subjectContains: INVITE_SUBJECT, urlContains: "/invite" });
	}

	async waitForToken(to: string, options: { subjectContains?: string; urlContains: string }) {
		const link = await this.waitForLink(to, options);
		const token = new URL(link).searchParams.get("token");

		if (!token) throw new Error(`link for ${to} had no token parameter: ${link}`);

		return token;
	}
}
