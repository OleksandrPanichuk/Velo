import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InboxView } from "@/features/notifications/ui/views/InboxView";
import { getWorkspaceBySlugFn } from "@/features/workspace/server";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({ title: "Inbox", noIndex: true });

interface InboxPageProps {
	params: Promise<{ workspaceSlug: string }>;
}

export default async function Page({ params }: InboxPageProps) {
	const { workspaceSlug } = await params;
	const workspace = await getWorkspaceBySlugFn(workspaceSlug);

	if (!workspace) {
		notFound();
	}

	return <InboxView workspaceId={workspace.id} />;
}
