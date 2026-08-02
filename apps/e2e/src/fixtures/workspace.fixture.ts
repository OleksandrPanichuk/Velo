import type { ApiClient } from "@/helpers/api";
import { buildWorkspace } from "@/helpers/factory";
import type { SignedInUser, TestWorkspace } from "@/fixtures/types";

export async function workspaceFixture(
	{ api, signedInUser }: { api: ApiClient; signedInUser: SignedInUser },
	use: (workspace: TestWorkspace) => Promise<void>,
) {
	void signedInUser;

	const { createWorkspace } = await api.createWorkspace(buildWorkspace());

	await use(createWorkspace);
}
