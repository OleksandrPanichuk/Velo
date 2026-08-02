import type { BrowserContext } from "@playwright/test";

import { ApiClient } from "@/helpers/api";

export async function apiFixture(
	{ context }: { context: BrowserContext },
	use: (client: ApiClient) => Promise<void>,
) {
	await use(new ApiClient(context.request));
}
