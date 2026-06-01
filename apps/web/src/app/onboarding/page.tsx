import { redirect } from "next/navigation";

import { ROUTES } from "@/constants";
import { OnboardingView } from "@/features/onboarding/ui/views/OnboardingView";
import { getWorkspacesFn } from "@/features/workspace/server";

export default async function OnboardingPage() {
	const workspaces = await getWorkspacesFn();

	if (workspaces.length) {
		redirect(ROUTES.workspace.root(workspaces.at(0)!.slug));
	}

	return <OnboardingView />;
}
