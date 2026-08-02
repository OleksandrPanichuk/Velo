import type { ApiClient } from "@/helpers/api";
import { buildUser } from "@/helpers/factory";
import type { SignedInUser } from "@/fixtures/types";

export async function signedInUserFixture(
	{ api }: { api: ApiClient },
	use: (user: SignedInUser) => Promise<void>,
) {
	const credentials = buildUser();
	const { signUp } = await api.signUp(credentials);
	await api.signIn(credentials.email, credentials.password);

	await use({ id: signUp.id, credentials });
}
