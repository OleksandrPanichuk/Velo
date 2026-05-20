import type { Metadata } from "next";

import { ROUTES } from "@/constants";
import { VerifyEmailView } from "@/features/auth/ui/views/VerifyEmailView";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
	title: "Verify email",
	path: ROUTES.auth.verifyEmail,
	noIndex: true,
});

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ token?: string }>;
}) {
	const { token } = await searchParams;
	return <VerifyEmailView token={token} />;
}
