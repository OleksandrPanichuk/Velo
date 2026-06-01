import { redirect } from "next/navigation";

import { ROUTES } from "@/constants";
import { getCurrentUserFn } from "@/features/users/server";
import { getWorkspacesFn } from "@/features/workspace/server";

export default async function Home() {
	const currentUser = await getCurrentUserFn();

	if (!currentUser) {
		redirect(ROUTES.auth.login);
	}

	const workspaces = await getWorkspacesFn();

	if (!workspaces.length) {
		redirect(ROUTES.onboarding);
	}

	redirect(ROUTES.workspace.root(workspaces.at(0)!.slug));
}
