import type { Metadata } from "next";

import { ROUTES } from "@/constants";
import { LoginView } from "@/features/auth/ui/views/LoginView";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
	title: "Sign in",
	path: ROUTES.auth.login,
	noIndex: true,
});

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ invite?: string }>;
}) {
	const { invite } = await searchParams;
	return <LoginView inviteToken={invite} />;
}
