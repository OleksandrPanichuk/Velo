import type { Metadata } from "next";

import { ROUTES } from "@/constants";
import { AcceptInviteView } from "@/features/invite/ui/views/AcceptInviteView";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
	title: "Accept invite",
	path: ROUTES.auth.invite,
	noIndex: true,
});

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ token?: string }>;
}) {
	const { token } = await searchParams;
	return <AcceptInviteView token={token} />;
}
