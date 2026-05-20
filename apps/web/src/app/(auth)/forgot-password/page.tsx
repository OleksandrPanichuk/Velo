import type { Metadata } from "next";

import { ROUTES } from "@/constants";
import { ForgotPasswordView } from "@/features/auth/ui/views/ForgotPasswordView";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
	title: "Forgot password",
	path: ROUTES.auth.forgotPassword,
	noIndex: true,
});

export default function Page() {
	return <ForgotPasswordView />;
}
