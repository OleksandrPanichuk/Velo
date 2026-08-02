import type { PlaywrightWorkerArgs } from "@playwright/test";

import { MailClient } from "@/helpers/mail";

export async function mailFixture(
	{ playwright }: PlaywrightWorkerArgs,
	use: (client: MailClient) => Promise<void>,
) {
	const request = await playwright.request.newContext();

	await use(new MailClient(request));

	await request.dispose();
}
