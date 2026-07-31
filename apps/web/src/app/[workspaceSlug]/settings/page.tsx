import type { Metadata } from "next";

import { WorkspaceSettingsView } from "@/features/workspace/ui/views/WorkspaceSettingsView";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({ title: "Workspace settings", noIndex: true });

interface WorkspaceSettingsPageProps {
	params: Promise<{ workspaceSlug: string }>;
}

export default async function Page({ params }: WorkspaceSettingsPageProps) {
	const { workspaceSlug } = await params;

	return <WorkspaceSettingsView slug={workspaceSlug} />;
}
