import { notFound, redirect } from "next/navigation";

import type { PropsWithChildren } from "react";

import { ROUTES } from "@/constants";
import { getCurrentUserFn } from "@/features/users/server";
import { getWorkspaceBySlugFn } from "@/features/workspace/server";
import { WorkspaceLayout } from "@/features/workspace/ui/layouts/WorkspaceLayout";

type WorkspaceRouteLayoutProps = PropsWithChildren<{
	params: Promise<{ workspaceSlug: string }>;
}>;

export default async function Layout({ children, params }: WorkspaceRouteLayoutProps) {
	const { workspaceSlug } = await params;

	const currentUser = await getCurrentUserFn();

	if (!currentUser) {
		redirect(ROUTES.auth.login);
	}

	const workspace = await getWorkspaceBySlugFn(workspaceSlug);

	if (!workspace) {
		notFound();
	}

	return (
		<WorkspaceLayout workspace={workspace} currentUser={currentUser}>
			{children}
		</WorkspaceLayout>
	);
}
