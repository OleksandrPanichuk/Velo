import type { Metadata } from "next";

import { ROUTES } from "@/constants";
import { RegisterView } from "@/features/auth/ui/views/RegisterView";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
	title: "Create account",
	path: ROUTES.auth.register,
	noIndex: true,
});

export default function Page() {
	return <RegisterView />;
}
