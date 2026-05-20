import type { Metadata } from "next";

import { ROUTES } from "@/constants";
import { ResetPasswordView } from "@/features/auth/ui/views/ResetPasswordView";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
	title: "Reset password",
	path: ROUTES.auth.resetPassword,
	noIndex: true,
});

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ token?: string }>;
}) {
	const { token } = await searchParams;
	return <ResetPasswordView token={token} />;
}
