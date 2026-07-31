import type { PropsWithChildren } from "react";

import { getWorkspacesFn } from "@/features/workspace/server";
import { WorkspaceSidebar } from "@/features/workspace/ui/components/WorkspaceSidebar";
import { ActiveWorkspaceProvider } from "@/features/workspace/ui/providers";
import type { UserFieldsFragment, WorkspaceBaseFragment } from "@/graphql/types";

type WorkspaceLayoutProps = PropsWithChildren<{
	workspace: WorkspaceBaseFragment;
	currentUser: UserFieldsFragment;
}>;

export async function WorkspaceLayout({
	workspace,
	currentUser,
	children,
}: WorkspaceLayoutProps) {
	const workspaces = await getWorkspacesFn();

	return (
		<ActiveWorkspaceProvider workspaceId={workspace.id}>
			<div className="bg-surface flex min-h-svh flex-col md:flex-row">
				<WorkspaceSidebar
					workspace={workspace}
					workspaces={workspaces}
					currentUser={currentUser}
				/>
				<main className="flex min-w-0 flex-1 flex-col">{children}</main>
			</div>
		</ActiveWorkspaceProvider>
	);
}
