import { MAILPIT_URL } from "@/config";

export default async function globalSetup() {
	try {
		const response = await fetch(`${MAILPIT_URL}/api/v1/info`);
		if (!response.ok) throw new Error(`status ${response.status}`);
	} catch (error) {
		throw new Error(
			`Mailpit is not reachable at ${MAILPIT_URL} (${(error as Error).message}).\n` +
				`Start the e2e infrastructure first:  bun run test:e2e:infra:up`,
		);
	}
}
