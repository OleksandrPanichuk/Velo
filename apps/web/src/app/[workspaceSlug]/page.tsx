import { redirect } from "next/navigation";

import { ROUTES } from "@/constants";

type WorkspacePageProps = {
	params: Promise<{ workspaceSlug: string }>;
};

export default async function WorkspacePage({ params }: WorkspacePageProps) {
	const { workspaceSlug } = await params;

	redirect(ROUTES.workspace.inbox(workspaceSlug));
}
