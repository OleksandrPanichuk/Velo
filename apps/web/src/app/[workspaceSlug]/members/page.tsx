import type { Metadata } from "next";

import { MembersView } from "@/features/workspace/ui/views/MembersView";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({ title: "Members", noIndex: true });

interface MembersPageProps {
	params: Promise<{ workspaceSlug: string }>;
}

export default async function Page({ params }: MembersPageProps) {
	const { workspaceSlug } = await params;

	return <MembersView slug={workspaceSlug} />;
}
